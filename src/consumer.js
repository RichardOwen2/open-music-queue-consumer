require('dotenv').config();

const amqp = require('amqplib');
const PlaylistService = require('./PlaylistsService');
const MailSender = require('./MailSender');
const Listener = require('./listener');
const config = require('./utils/config');

const init = async () => {
  const playlistService = new PlaylistService();
  const mailSender = new MailSender();
  const listener = new Listener(playlistService, mailSender);

  const connection = await amqp.connect(config.rabbitMq.server);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:playlist', {
    durable: true,
  });

  channel.consume('export:playlist', listener.listen, { noAck: true });
};

init();
