const path = require("path");
const mysql = require("mysql2");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// ✅ 1. Đổi createConnection → createPool, thêm 3 dòng config
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection((err, connection) => {
  if (err) {
    console.log("❌ Lỗi kết nối:", err);
  } else {
    console.log("✅ Đã bắt được MySQL!!!");
    connection.release();
  }
});

module.exports = db;