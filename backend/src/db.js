const mysql = require("mysql2");

require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST, // nếu nếu máy khác đăng nhập thì qua .env đổi thành DB.HOST = 192.168.3.157
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect((err) => {
  if (err) {
    console.log("❌ Lỗi kết nối:", err);
  } else {
    console.log("✅ Đã bắt được MySQL!!!");
  }
});

module.exports = db;