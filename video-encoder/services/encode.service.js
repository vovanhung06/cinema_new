const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const { UPLOAD_DIR, OUTPUT_DIR } = require('../config');
const { uploadFolder } = require('./bunnyStorageService');
require('dotenv').config();

// ─── Constants ───────────────────────────────────────────────────────────────

const ENCODE_TIMEOUT_MS = 2 * 60 * 60 * 1000; // 2 giờ
const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024;  // 5GB
const ALLOWED_EXTENSIONS = ['.mp4', '.mkv', '.avi', '.mov', '.webm', '.flv'];
const HLS_SEGMENT_DURATION = 4;
const KEYFRAME_INTERVAL = 48;

const ALL_VARIANTS = [
  {
    name: '360p',
    height: 360,
    scale: '640:-2',
    bandwidth: '800k',
    maxrate: '856k',
    bufsize: '1200k',
    audioBitrate: '96k',
    bandwidth_bps: 800000,
    resolution: '640x360',
    profile: 'baseline',
    level: '3.0',
  },
  {
    name: '720p',
    height: 720,
    scale: '1280:-2',
    bandwidth: '2500k',
    maxrate: '2675k',
    bufsize: '3750k',
    audioBitrate: '128k',
    bandwidth_bps: 2500000,
    resolution: '1280x720',
    profile: 'main',
    level: '3.1',
  },
  {
    name: '1080p',
    height: 1080,
    scale: '1920:-2',
    bandwidth: '5000k',
    maxrate: '5350k',
    bufsize: '7500k',
    audioBitrate: '192k',
    bandwidth_bps: 5000000,
    resolution: '1920x1080',
    profile: 'high',
    level: '4.0',
  },
];

// ─── FFmpeg Path Setup ───────────────────────────────────────────────────────

function setupFFmpegPaths() {
  if (process.platform === 'win32') {
    const ffmpegPath = 'C:\\ffmpeg\\bin\\ffmpeg.exe';
    const ffprobePath = 'C:\\ffmpeg\\bin\\ffprobe.exe';
    if (fs.existsSync(ffmpegPath)) ffmpeg.setFfmpegPath(ffmpegPath);
    if (fs.existsSync(ffprobePath)) ffmpeg.setFfprobePath(ffprobePath);
  }

  if (process.platform === 'darwin') {
    const candidates = ['/opt/homebrew/bin', '/usr/local/bin', '/usr/bin'];
    const ffmpegPath = candidates.map(d => `${d}/ffmpeg`).find(fs.existsSync);
    const ffprobePath = candidates.map(d => `${d}/ffprobe`).find(fs.existsSync);
    if (ffmpegPath) ffmpeg.setFfmpegPath(ffmpegPath);
    if (ffprobePath) ffmpeg.setFfprobePath(ffprobePath);
  }
}

setupFFmpegPaths();

// ─── Active encode tracking (prevent duplicates) ────────────────────────────

const activeEncodes = new Set();

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getVideoInfo(inputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) return reject(new Error(`ffprobe thất bại: ${err.message}`));

      const videoStream = metadata.streams.find(s => s.codec_type === 'video');
      const audioStream = metadata.streams.find(s => s.codec_type === 'audio');

      if (!videoStream) return reject(new Error('Không tìm thấy video stream'));

      resolve({
        width: videoStream.width,
        height: videoStream.height,
        duration: parseFloat(metadata.format.duration) || 0,
        codec: videoStream.codec_name,
        hasAudio: !!audioStream,
      });
    });
  });
}

function selectVariants(videoHeight) {
  const filtered = ALL_VARIANTS.filter(v => v.height <= videoHeight);
  return filtered.length > 0 ? filtered : [ALL_VARIANTS[0]];
}

function validateInput(inputPath, filename) {
  if (!fs.existsSync(inputPath)) {
    throw new Error(`File video không tồn tại: ${inputPath}`);
  }

  const ext = path.extname(filename).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error(`Định dạng không hỗ trợ: ${ext}`);
  }

  const stats = fs.statSync(inputPath);
  if (stats.size === 0) throw new Error('File video rỗng');
  if (stats.size > MAX_FILE_SIZE) {
    throw new Error(`File quá lớn: ${(stats.size / 1024 / 1024 / 1024).toFixed(1)}GB`);
  }
}

function buildOutputOptions(variant, segmentPath, hasAudio) {
  const videoOpts = [
    `-vf scale=${variant.scale}`,
    `-c:v libx264`,
    `-profile:v ${variant.profile}`,
    `-level ${variant.level}`,
    `-pix_fmt yuv420p`,
    `-preset fast`,
    `-b:v ${variant.bandwidth}`,
    `-maxrate ${variant.maxrate}`,
    `-bufsize ${variant.bufsize}`,
    `-g ${KEYFRAME_INTERVAL}`,
    `-keyint_min ${KEYFRAME_INTERVAL}`,
    `-sc_threshold 0`,
    `-map 0:v:0`,
  ];

  const audioOpts = hasAudio
    ? [`-c:a aac`, `-ar 44100`, `-ac 2`, `-b:a ${variant.audioBitrate}`, `-map 0:a:0`]
    : [`-an`];

  const hlsOpts = [
    `-hls_time ${HLS_SEGMENT_DURATION}`,
    `-hls_list_size 0`,
    `-hls_segment_type mpegts`,
    `-hls_playlist_type vod`,
    `-hls_segment_filename ${segmentPath}`,
    `-f hls`,
  ];

  return [...videoOpts, ...audioOpts, ...hlsOpts];
}

function buildMasterPlaylist(variants) {
  const lines = ['#EXTM3U', '#EXT-X-VERSION:3'];
  variants.forEach(v => {
    const codecs = v.profile === 'high'
      ? 'avc1.640028,mp4a.40.2'
      : v.profile === 'main'
        ? 'avc1.4d401f,mp4a.40.2'
        : 'avc1.42e01e,mp4a.40.2';

    lines.push(
      `#EXT-X-STREAM-INF:BANDWIDTH=${v.bandwidth_bps},RESOLUTION=${v.resolution},CODECS="${codecs}"`
    );
    lines.push(`${v.name}/index.m3u8`);
  });
  return lines.join('\n') + '\n';
}

function cleanup(movieOutputDir, inputPath) {
  try {
    fs.rmSync(movieOutputDir, { recursive: true, force: true });
    fs.unlinkSync(inputPath);
    console.log(`[encode] 🗑️  Đã xóa file tạm và file gốc`);
  } catch (err) {
    console.warn(`[encode] ⚠️  Cleanup: ${err.message}`);
  }
}

// ─── Main Function ───────────────────────────────────────────────────────────

async function convertToHLS(filename, movieId) {
  const lockKey = movieId.toString();
  if (activeEncodes.has(lockKey)) {
    throw new Error(`Movie ${movieId} đang được encode`);
  }

  activeEncodes.add(lockKey);

  const inputPath = path.join(UPLOAD_DIR, filename);
  const movieOutputDir = path.join(OUTPUT_DIR, lockKey);
  const hlsOutputDir = path.join(movieOutputDir, 'hls');

  try {
    // ── Validate ──
    validateInput(inputPath, filename);
    console.log(`[encode] Bắt đầu xử lý: ${filename} (movieId: ${movieId})`);

    // ── Probe ──
    const videoInfo = await getVideoInfo(inputPath);
    console.log(`[encode] Video: ${videoInfo.width}x${videoInfo.height}, ` +
      `audio: ${videoInfo.hasAudio ? 'có' : 'KHÔNG'}, ` +
      `duration: ${Math.round(videoInfo.duration)}s`);

    // ── Select Variants ──
    const variants = selectVariants(videoInfo.height);
    console.log(`[encode] Variants: ${variants.map(v => v.name).join(', ')}`);

    // ── Create Dirs ──
    fs.mkdirSync(hlsOutputDir, { recursive: true });
    variants.forEach(v => fs.mkdirSync(path.join(hlsOutputDir, v.name), { recursive: true }));

    // ── Encode ──
    await new Promise((resolve, reject) => {
      let cmd = ffmpeg(inputPath).inputOptions(['-hide_banner']);

      const timeout = setTimeout(() => {
        cmd.kill('SIGKILL');
        reject(new Error(`Encode timeout sau ${ENCODE_TIMEOUT_MS / 1000 / 60} phút`));
      }, ENCODE_TIMEOUT_MS);

      variants.forEach(variant => {
        const segmentPath = path.join(hlsOutputDir, variant.name, `${variant.name}-%03d.ts`);
        const playlistPath = path.join(hlsOutputDir, variant.name, 'index.m3u8');

        cmd = cmd
          .output(playlistPath)
          .outputOptions(buildOutputOptions(variant, segmentPath, videoInfo.hasAudio));
      });

      cmd
        .on('start', () => console.log('[encode] FFmpeg bắt đầu...'))
        .on('progress', (p) => {
          if (p.percent) process.stdout.write(`\r[encode] Tiến độ: ${Math.round(p.percent)}%`);
        })
        .on('end', () => { clearTimeout(timeout); console.log('\n[encode] ✅ Encode hoàn tất'); resolve(); })
        .on('error', (err) => { clearTimeout(timeout); reject(new Error(`FFmpeg: ${err.message}`)); })
        .run();
    });

    // ── Master Playlist ──
    const masterContent = buildMasterPlaylist(variants);
    fs.writeFileSync(path.join(hlsOutputDir, 'master.m3u8'), masterContent);
    console.log('[encode] ✅ master.m3u8 tạo xong');

    // ── Upload ──
    const remotePath = `hls/${movieId}`;
    console.log(`[encode] Uploading → ${remotePath}`);
    await uploadFolder(hlsOutputDir, remotePath);

    // ── Cleanup ──
    cleanup(movieOutputDir, inputPath);

    // ── Return URL ──
    const hlsUrl = `${process.env.BUNNY_PULL_ZONE_URL}/${movieId}/master.m3u8`;
    console.log(`[encode] 🚀 ${hlsUrl}`);
    return hlsUrl;

  } finally {
    activeEncodes.delete(lockKey);
  }
}

module.exports = { convertToHLS };