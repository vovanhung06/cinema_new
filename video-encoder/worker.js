console.log('🚀 Video Encoder Worker đang khởi động...');

const { processNextJob } = require('./controllers/job.controller');

const POLL_INTERVAL = 5000; // Kiểm tra job mỗi 5 giây
let isProcessing = false;

async function checkAndProcessJobs() {
  // Tránh chạy 2 job cùng lúc
  if (isProcessing) return;

  isProcessing = true;
  try {
    const result = await processNextJob();

    if (result === null) {
      // Không có job → im lặng, không log spam
    } else if (result.success) {
      console.log(`[worker] ✅ Job hoàn thành: movieId=${result.job.movieId}`);
      console.log(`[worker] 🎬 URL: ${result.hlsUrl}`);
    } else {
      console.warn(`[worker] ⚠️  Job chưa hoàn thành: ${result.error}`);
    }
  } catch (error) {
    // Lỗi không mong muốn từ worker (không phải từ job)
    console.error('[worker] ❌ Lỗi nghiêm trọng:', error.message);
    console.error(error.stack);
  } finally {
    isProcessing = false;
  }
}

// Bắt đầu polling
const timer = setInterval(checkAndProcessJobs, POLL_INTERVAL);
console.log(`[worker] ✅ Đang chờ job (poll mỗi ${POLL_INTERVAL / 1000}s)...`);

// ── Graceful shutdown ─────────────────────────────────────────────────────────
function shutdown(signal) {
  console.log(`\n[worker] Nhận ${signal}, đang tắt...`);
  clearInterval(timer);

  // Nếu đang xử lý job, chờ tối đa 30 giây
  if (isProcessing) {
    console.log('[worker] Đang chờ job hiện tại hoàn thành (tối đa 30s)...');
    const deadline = Date.now() + 30000;
    const wait = setInterval(() => {
      if (!isProcessing || Date.now() > deadline) {
        clearInterval(wait);
        console.log('[worker] Đã tắt.');
        process.exit(0);
      }
    }, 500);
  } else {
    console.log('[worker] Đã tắt.');
    process.exit(0);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));