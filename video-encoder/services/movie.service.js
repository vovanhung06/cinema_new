const db = require('../config/db');

async function updateMovieHLS(movieId, hlsUrl) {
  try {
    const sql = `
      UPDATE movies 
      SET movie_url = ? 
      WHERE id = ?
    `;

    const [result] = await db.query(sql, [hlsUrl, movieId]); // ✅ FIX ở đây

    console.log('[movie.service] Updated movie HLS:', movieId, hlsUrl);
    return result;
  } catch (error) {
    console.error('[movie.service] Error updating movie HLS:', error);
    throw error;
  }
}

module.exports = { updateMovieHLS };