const path = require('path');

module.exports = {
  JOB_FILE: path.join(__dirname, '../../backend/jobs.json'),
  UPLOAD_DIR: path.join(__dirname, '../../backend/uploads/encoded'),
  OUTPUT_DIR: path.join(__dirname, '../../backend/uploads/encoded')
};