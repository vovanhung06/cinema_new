const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const { UPLOAD_DIR, OUTPUT_DIR } = require('../config');
const { uploadFolder } = require('./bunnyStorageService');
const dotenv = require('dotenv');

dotenv.config();

// Set FFmpeg and FFprobe path for Windows
if (process.platform === 'win32') {
  const ffmpegPath = 'C:\\ffmpeg\\bin\\ffmpeg.exe';
  const ffprobePath = 'C:\\ffmpeg\\bin\\ffprobe.exe';
  
  if (fs.existsSync(ffmpegPath)) {
    ffmpeg.setFfmpegPath(ffmpegPath);
    console.log('[encode.service] FFmpeg path set to:', ffmpegPath);
  } else {
    console.warn('[encode.service] FFmpeg not found at:', ffmpegPath);
  }
  
  if (fs.existsSync(ffprobePath)) {
    ffmpeg.setFfprobePath(ffprobePath);
    console.log('[encode.service] FFprobe path set to:', ffprobePath);
  }
}

// Set FFmpeg and FFprobe path for Mac (Apple Silicon or Intel)
if (process.platform === 'darwin') {
  const ffmpegPaths = [
    '/opt/homebrew/bin/ffmpeg',
    '/usr/local/bin/ffmpeg',
    '/usr/bin/ffmpeg'
  ];
  const ffprobePaths = [
    '/opt/homebrew/bin/ffprobe',
    '/usr/local/bin/ffprobe',
    '/usr/bin/ffprobe'
  ];
  
  const ffmpegPath = ffmpegPaths.find(p => fs.existsSync(p));
  const ffprobePath = ffprobePaths.find(p => fs.existsSync(p));
  
  if (ffmpegPath) {
    ffmpeg.setFfmpegPath(ffmpegPath);
    process.env.FFMPEG_PATH = ffmpegPath; // Also set env var for robustness
    console.log('[encode.service] ✅ FFmpeg path set to:', ffmpegPath);
  } else {
    console.error('[encode.service] ❌ FFmpeg NOT FOUND on Mac! Checked paths:', ffmpegPaths);
  }
  
  if (ffprobePath) {
    ffmpeg.setFfprobePath(ffprobePath);
    process.env.FFPROBE_PATH = ffprobePath; // Also set env var for robustness
    console.log('[encode.service] ✅ FFprobe path set to:', ffprobePath);
  } else {
    console.error('[encode.service] ❌ FFprobe NOT FOUND on Mac! Checked paths:', ffprobePaths);
  }
}

function convertToHLS(filename, movieId) {
  return new Promise((resolve, reject) => {
    const inputPath = path.join(UPLOAD_DIR, filename);
    const outputDir = path.join(OUTPUT_DIR, movieId.toString(), 'hls');

    console.log('[encode.service] convertToHLS', { inputPath, outputDir });

    if (!fs.existsSync(inputPath)) {
      return reject(new Error(`Input video not found: ${inputPath}`));
    }

    fs.mkdirSync(outputDir, { recursive: true });

    // Định nghĩa các variant bitrates
    const variants = [
      { bitrate: '360p', bandwidth: '800k', bufsize: '1200k' },
      { bitrate: '720p', bandwidth: '2500k', bufsize: '3750k' },
      { bitrate: '1080p', bandwidth: '5000k', bufsize: '7500k' }
    ];

    let command = ffmpeg(inputPath);

    // Tạo output cho mỗi variant
    variants.forEach((variant, index) => {
      const variantDir = path.join(outputDir, variant.bitrate);
      fs.mkdirSync(variantDir, { recursive: true });

      command = command
        .output(path.join(variantDir, 'index.m3u8'))
        .outputOptions([
          `-c:v libx264`,
          `-c:a aac`,
          `-b:v ${variant.bandwidth}`,
          `-maxrate ${variant.bandwidth}`,
          `-bufsize ${variant.bufsize}`,
          `-b:a 128k`,
          `-hls_time 10`,
          `-hls_list_size 0`,
          `-hls_segment_filename ${path.join(variantDir, 'segment-%03d.ts')}`,
          `-f hls`
        ]);
    });

    // Tạo master playlist
    const masterPlaylist = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360
360p/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2500000,RESOLUTION=1280x720
720p/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080
1080p/index.m3u8
`;

    command
      .on('start', (cmd) => {
        console.log('[encode.service] FFmpeg start:', cmd);
      })
      .on('end', async () => {
        console.log('✅ Encode xong:', filename);

        try {
          // Ghi master playlist
          fs.writeFileSync(path.join(outputDir, 'master.m3u8'), masterPlaylist);

          console.log('[encode.service] Bắt đầu upload lên Bunny CDN...');
          
          // Upload lên Bunny Storage
          // Remote path: hls/{movieId}
          const remotePath = `hls/${movieId}`;
          await uploadFolder(outputDir, remotePath);
          
          console.log('🚀 [encode.service] Đã upload lên Bunny thành công!');

          // Trả về URL Bunny CDN
          const hlsUrl = `${process.env.BUNNY_PULL_ZONE_URL}/${movieId}/master.m3u8`;
          resolve(hlsUrl);
        } catch (uploadError) {
          console.error('❌ [encode.service] Lỗi khi upload lên Bunny:', uploadError.message);
          reject(uploadError);
        }
      })
      .on('error', (err) => {
        console.error('[encode.service] FFmpeg error:', err.message);
        reject(err);
      })
      .run();
  });
}

module.exports = { convertToHLS };