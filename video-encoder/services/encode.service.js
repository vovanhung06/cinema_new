const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const { UPLOAD_DIR, OUTPUT_DIR } = require('../config');
const { uploadFolder } = require('./bunnyStorageService');
const dotenv = require('dotenv');

dotenv.config();

// ─── Cấu hình đường dẫn FFmpeg theo OS ───────────────────────────────────────

if (process.platform === 'win32') {
  const ffmpegPath = 'C:\\ffmpeg\\bin\\ffmpeg.exe';
  const ffprobePath = 'C:\\ffmpeg\\bin\\ffprobe.exe';
  if (fs.existsSync(ffmpegPath)) ffmpeg.setFfmpegPath(ffmpegPath);
  if (fs.existsSync(ffprobePath)) ffmpeg.setFfprobePath(ffprobePath);
}

if (process.platform === 'darwin') {
  const candidates = ['/opt/homebrew/bin', '/usr/local/bin', '/usr/bin'];
  const ffmpegPath = candidates.map(d => `${d}/ffmpeg`).find(p => fs.existsSync(p));
  const ffprobePath = candidates.map(d => `${d}/ffprobe`).find(p => fs.existsSync(p));
  if (ffmpegPath) { ffmpeg.setFfmpegPath(ffmpegPath); process.env.FFMPEG_PATH = ffmpegPath; }
  if (ffprobePath) { ffmpeg.setFfprobePath(ffprobePath); process.env.FFPROBE_PATH = ffprobePath; }
}

// Linux VPS: ffmpeg thường nằm ở /usr/bin/ffmpeg, không cần set thêm

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Lấy thông tin video thực tế bằng ffprobe
 */
function getVideoInfo(inputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) return reject(new Error(`ffprobe thất bại: ${err.message}`));
      const videoStream = metadata.streams.find(s => s.codec_type === 'video');
      if (!videoStream) return reject(new Error('Không tìm thấy video stream'));
      resolve({
        width: videoStream.width,
        height: videoStream.height,
        duration: metadata.format.duration,
        codec: videoStream.codec_name,
      });
    });
  });
}

/**
 * Chọn các variant phù hợp theo resolution thực tế của video
 * Tránh encode lên chất lượng cao hơn video gốc
 */
function selectVariants(videoHeight) {
  const ALL_VARIANTS = [
    {
      name: '360p',
      scale: '640:-2',
      bandwidth: '800k',
      maxrate: '856k',
      bufsize: '1200k',
      audioBitrate: '96k',
      banwidth_bps: 800000,
      resolution: '640x360',
    },
    {
      name: '720p',
      scale: '1280:-2',
      bandwidth: '2500k',
      maxrate: '2675k',
      bufsize: '3750k',
      audioBitrate: '128k',
      banwidth_bps: 2500000,
      resolution: '1280x720',
    },
    {
      name: '1080p',
      scale: '1920:-2',
      bandwidth: '5000k',
      maxrate: '5350k',
      bufsize: '7500k',
      audioBitrate: '192k',
      banwidth_bps: 5000000,
      resolution: '1920x1080',
    },
  ];

  // Chỉ giữ những variant có độ phân giải ≤ video gốc
  // Luôn giữ ít nhất 360p
  const filtered = ALL_VARIANTS.filter(v => {
    const variantHeight = parseInt(v.name);
    return variantHeight <= videoHeight;
  });

  return filtered.length > 0 ? filtered : [ALL_VARIANTS[0]];
}

// ─── Hàm chính ───────────────────────────────────────────────────────────────

/**
 * Encode video thành HLS multi-bitrate và upload lên Bunny CDN
 * @param {string} filename - Tên file video trong UPLOAD_DIR
 * @param {number|string} movieId - ID phim trong database
 * @returns {Promise<string>} URL HLS để lưu vào DB
 */
async function convertToHLS(filename, movieId) {
  const inputPath = path.join(UPLOAD_DIR, filename);
  const movieOutputDir = path.join(OUTPUT_DIR, movieId.toString());
  const hlsOutputDir = path.join(movieOutputDir, 'hls');

  // ── Validate ──────────────────────────────────────────────────────────────
  if (!fs.existsSync(inputPath)) {
    throw new Error(`File video không tồn tại: ${inputPath}`);
  }

  console.log(`[encode] Bắt đầu xử lý: ${filename} (movieId: ${movieId})`);

  // ── Lấy thông tin video gốc ───────────────────────────────────────────────
  const videoInfo = await getVideoInfo(inputPath);
  console.log(`[encode] Video info: ${videoInfo.width}x${videoInfo.height}, codec: ${videoInfo.codec}, duration: ${Math.round(videoInfo.duration)}s`);

  // ── Chọn variants phù hợp ─────────────────────────────────────────────────
  const variants = selectVariants(videoInfo.height);
  console.log(`[encode] Sẽ encode ${variants.length} chất lượng: ${variants.map(v => v.name).join(', ')}`);

  // ── Tạo thư mục output ────────────────────────────────────────────────────
  fs.mkdirSync(hlsOutputDir, { recursive: true });
  variants.forEach(v => fs.mkdirSync(path.join(hlsOutputDir, v.name), { recursive: true }));

  // ── Encode với FFmpeg ─────────────────────────────────────────────────────
  await new Promise((resolve, reject) => {
    let cmd = ffmpeg(inputPath);

    // Dùng GPU nếu có (Linux VPS thường có thể dùng VAAPI hoặc NVENC)
    // Fallback về CPU nếu không có GPU
    cmd.inputOptions(['-hide_banner']);

    variants.forEach((variant) => {
      const segmentPath = path.join(hlsOutputDir, variant.name, `${variant.name}-segment-%03d.ts`);
      const playlistPath = path.join(hlsOutputDir, variant.name, 'index.m3u8');

      cmd = cmd
        .output(playlistPath)
        .outputOptions([
          `-vf scale=${variant.scale}`,        // scale giữ aspect ratio
          `-c:v libx264`,
          `-preset fast`,                       // fast = cân bằng tốc độ/chất lượng
          `-c:a aac`,
          `-b:a ${variant.audioBitrate}`,
          `-b:v ${variant.bandwidth}`,
          `-maxrate ${variant.maxrate}`,
          `-bufsize ${variant.bufsize}`,
          `-hls_time 4`,                        // mỗi segment 4 giây
          `-hls_list_size 0`,                   // giữ toàn bộ segment trong playlist
          `-hls_segment_type mpegts`,
          `-hls_segment_filename ${segmentPath}`,
          `-f hls`,
        ]);
    });

    cmd
      .on('start', (cmdLine) => {
        console.log('[encode] FFmpeg bắt đầu...');
      })
      .on('progress', (progress) => {
        if (progress.percent) {
          process.stdout.write(`\r[encode] Tiến độ: ${Math.round(progress.percent)}%`);
        }
      })
      .on('end', () => {
        console.log('\n[encode] ✅ FFmpeg encode hoàn tất');
        resolve();
      })
      .on('error', (err) => {
        console.error('\n[encode] ❌ FFmpeg lỗi:', err.message);
        reject(new Error(`FFmpeg thất bại: ${err.message}`));
      })
      .run();
  });

  // ── Tạo master playlist động (theo variants thực tế) ─────────────────────
  const masterLines = ['#EXTM3U', '#EXT-X-VERSION:3'];
  variants.forEach(v => {
    masterLines.push(`#EXT-X-STREAM-INF:BANDWIDTH=${v.banwidth_bps},RESOLUTION=${v.resolution}`);
    masterLines.push(`${v.name}/index.m3u8`);
  });
  const masterPlaylist = masterLines.join('\n') + '\n';
  fs.writeFileSync(path.join(hlsOutputDir, 'master.m3u8'), masterPlaylist);
  console.log('[encode] ✅ Tạo master.m3u8 hoàn tất');

  // ── Upload lên Bunny Storage ──────────────────────────────────────────────
  // remotePath = hls/{movieId} → file sẽ nằm ở: cinemaplus/hls/{movieId}/...
  // Pull Zone URL: https://cinemaplus.b-cdn.net
  // URL phát video: https://cinemaplus.b-cdn.net/hls/{movieId}/master.m3u8
  const remotePath = `hls/${movieId}`;
  console.log(`[encode] Bắt đầu upload lên Bunny: ${remotePath}`);
  await uploadFolder(hlsOutputDir, remotePath);

  // ── Xóa file tạm ─────────────────────────────────────────────────────────
  try {
    fs.rmSync(movieOutputDir, { recursive: true, force: true });
    console.log(`[encode] 🗑️  Đã xóa file tạm: ${movieOutputDir}`);
  } catch (cleanupErr) {
    // Không throw — xóa thất bại không ảnh hưởng kết quả
    console.warn(`[encode] ⚠️  Không xóa được file tạm: ${cleanupErr.message}`);
  }

  // ── Trả về URL để lưu vào DB ──────────────────────────────────────────────
  // BUNNY_PULL_ZONE_URL = https://cinemaplus.b-cdn.net/hls (có sẵn /hls)
  const hlsUrl = `${process.env.BUNNY_PULL_ZONE_URL}/${movieId}/master.m3u8`;
  console.log(`[encode] 🚀 HLS URL: ${hlsUrl}`);
  return hlsUrl;
}

module.exports = { convertToHLS };