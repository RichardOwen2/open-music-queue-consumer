/* eslint-disable camelcase */

const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylist(playlistId) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username,
      songs.id AS song_id, songs.title, songs.performer FROM playlists
      JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id 
      JOIN songs ON songs.id = playlist_songs.song_id
      JOIN users ON users.id = playlists.owner
      WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return {
      playlist: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        songs: result.rows.map(({ song_id, title, performer }) => ({
          id: song_id,
          title,
          performer,
        })),
      },
    };
  }
}

module.exports = PlaylistsService;
