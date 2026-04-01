console.log('Worker starting...');
const { processNextJob } = require('./controllers/job.controller');

console.log('🚀 Video Encoder Worker đang chạy...');

const POLL_INTERVAL = 5000; // 5 seconds
let isProcessing = false;

async function checkAndProcessJobs() {
  if (isProcessing) {
    console.log('[worker] Đang xử lý job, bỏ qua lần này...');
    return;
  }

  isProcessing = true;
  try {
    const result = await processNextJob();
    if (result && !result.success) {
      console.warn('[worker] Job xử lý không thành công:', result.error);
    }
  } catch (error) {
    console.error('[worker] ❌ Lỗi không mong muốn:', error.message);
    console.error(error.stack);
  } finally {
    isProcessing = false;
  }
}

setInterval(checkAndProcessJobs, POLL_INTERVAL);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[worker] Nhận SIGTERM, đang tắt...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('[worker] Nhận SIGINT, đang tắt...');
  process.exit(0);
});