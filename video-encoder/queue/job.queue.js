const fs = require('fs');
const path = require('path');
const { JOB_FILE } = require('../config');

// File lưu các job thất bại để xem lại
const FAILED_JOB_FILE = JOB_FILE.replace('.json', '.failed.json');

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Đọc file JSON an toàn — trả về [] nếu file lỗi hoặc chưa tồn tại
 */
function safeReadJSON(file) {
  try {
    if (!fs.existsSync(file)) return [];
    const raw = fs.readFileSync(file, 'utf8').trim();
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[job.queue] ⚠️  Không đọc được ${file}:`, err.message);
    // Backup file bị hỏng
    try {
      fs.copyFileSync(file, `${file}.corrupt.${Date.now()}`);
      fs.writeFileSync(file, '[]');
    } catch (_) { }
    return [];
  }
}

/**
 * Ghi file JSON theo kiểu atomic:
 * Ghi ra file .tmp trước → đổi tên → tránh mất dữ liệu nếu crash giữa chừng
 */
function atomicWriteJSON(file, data) {
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmp, file); // atomic trên Linux
}

// ─── Queue operations ─────────────────────────────────────────────────────────

/**
 * Lấy toàn bộ job đang chờ
 */
function getAllJobs() {
  const jobs = safeReadJSON(JOB_FILE);
  console.log(`[job.queue] ${jobs.length} job đang chờ`);
  return jobs;
}

/**
 * Lấy job tiếp theo (FIFO) và xóa khỏi queue
 */
function getNextJob() {
  const jobs = safeReadJSON(JOB_FILE);
  if (jobs.length === 0) return null;

  const job = jobs.shift();
  atomicWriteJSON(JOB_FILE, jobs);

  console.log(`[job.queue] Lấy job: movieId=${job.movieId}, file=${job.file}, attempt=${job.attempt || 1}`);
  return job;
}

/**
 * Đưa job trở lại cuối queue (dùng khi retry)
 */
function requeueJob(job) {
  const jobs = safeReadJSON(JOB_FILE);
  jobs.push(job);
  atomicWriteJSON(JOB_FILE, jobs);
  console.log(`[job.queue] 🔄 Requeue job: movieId=${job.movieId} (attempt ${job.attempt})`);
}

/**
 * Lưu job thất bại vĩnh viễn vào file riêng để xem lại
 */
function saveFailedJob(job, errorMessage) {
  const failed = safeReadJSON(FAILED_JOB_FILE);
  failed.push({
    ...job,
    failedAt: new Date().toISOString(),
    error: errorMessage,
  });
  atomicWriteJSON(FAILED_JOB_FILE, failed);
  console.log(`[job.queue] 💀 Lưu job thất bại: movieId=${job.movieId}`);
}

/**
 * Thêm job mới vào queue
 */
function addJob(file, movieId) {
  const jobs = safeReadJSON(JOB_FILE);
  const job = {
    file,
    movieId,
    attempt: 1,
    createdAt: new Date().toISOString(),
  };
  jobs.push(job);
  atomicWriteJSON(JOB_FILE, jobs);
  console.log(`[job.queue] ➕ Thêm job: movieId=${movieId}, file=${file}`);
  return job;
}

module.exports = { getAllJobs, getNextJob, requeueJob, saveFailedJob, addJob };