const { getNextJob, requeueJob, saveFailedJob } = require('../queue/job.queue');
const { convertToHLS } = require('../services/encode.service');
const { updateMovieHLS } = require('../services/movie.service');

const MAX_RETRY = 3; // Số lần thử tối đa mỗi job

/**
 * Xử lý job tiếp theo trong queue
 * - Thành công: cập nhật URL vào DB
 * - Thất bại:   retry tối đa MAX_RETRY lần, sau đó lưu vào failed queue
 */
async function processNextJob() {
  const job = getNextJob();
  if (!job) {
    console.log('[job.controller] Không có job nào đang chờ.');
    return null;
  }

  const attempt = job.attempt || 1;
  console.log(`[job.controller] Xử lý job: movieId=${job.movieId}, lần ${attempt}/${MAX_RETRY}`);

  try {
    // ── Bước 1: Encode video → HLS, upload Bunny, nhận về URL ──────────────
    const hlsUrl = await convertToHLS(job.file, job.movieId);
    console.log(`[job.controller] ✅ HLS URL: ${hlsUrl}`);

    // ── Bước 2: Lưu URL vào database ────────────────────────────────────────
    await updateMovieHLS(job.movieId, hlsUrl);
    console.log(`[job.controller] ✅ Đã lưu URL vào DB: movieId=${job.movieId}`);

    return { success: true, job, hlsUrl };

  } catch (error) {
    console.error(`[job.controller] ❌ Job thất bại (lần ${attempt}): ${error.message}`);

    if (attempt < MAX_RETRY) {
      // Còn lượt retry → đưa lại vào queue với attempt tăng lên
      const delay = attempt * 10000; // 10s, 20s
      console.log(`[job.controller] 🔄 Sẽ retry sau ${delay / 1000}s...`);

      setTimeout(() => {
        requeueJob({ ...job, attempt: attempt + 1 });
      }, delay);

    } else {
      // Hết lượt retry → lưu vào failed queue
      console.error(`[job.controller] 💀 Job thất bại sau ${MAX_RETRY} lần: movieId=${job.movieId}`);
      saveFailedJob(job, error.message);
    }

    return { success: false, job, error: error.message };
  }
}

module.exports = { processNextJob };