const path = require('path');

module.exports = {
  JOB_FILE: path.join(__dirname, '../../backend/jobs.json'),

  // Video gốc user upload lên (backend lưu ở đây)
  UPLOAD_DIR: path.join(__dirname, '../../backend/uploads/original'),

  // Thư mục FFmpeg xuất HLS tạm — dùng thư mục riêng trong video-encoder
  OUTPUT_DIR: path.join(__dirname, '../temp'),
};