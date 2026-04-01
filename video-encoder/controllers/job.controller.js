const { getNextJob } = require('../queue/job.queue');
const { convertToHLS } = require('../services/encode.service');
const { updateMovieHLS } = require('../services/movie.service');

async function processNextJob() {
  const job = getNextJob();
  if (!job) {
    console.log('[job.controller] Không có job nào để xử lý.');
    return;
  }

  console.log('[job.controller] Đang xử lý job:', job);

  try {
    // Encode video thành HLS
    const hlsUrl = await convertToHLS(job.file, job.movieId);
    console.log('[job.controller] HLS URL:', hlsUrl);

    // Cập nhật URL vào database
    await updateMovieHLS(job.movieId, hlsUrl);

    console.log('✅ [job.controller] Job hoàn thành:', job);
    return { success: true, job, hlsUrl };
  } catch (error) {
    console.error('❌ [job.controller] Lỗi khi xử lý job:', error.message);
    console.error(error.stack);

    // TODO: Thêm logic retry hoặc mark job failed
    // Có thể lưu job failed vào file khác để xử lý sau
    return { success: false, job, error: error.message };
  }
}

module.exports = { processNextJob };