const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'root1234',
  database: 'movie_v5'
});

module.exports = db;
