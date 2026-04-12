const axios = require('axios');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const STORAGE_ZONE_NAME = process.env.BUNNY_STORAGE_ZONE_NAME;
const ACCESS_KEY = process.env.BUNNY_STORAGE_ACCESS_KEY;
const BASE_URL = `https://sg.storage.bunnycdn.com/${STORAGE_ZONE_NAME}`;

const CONCURRENCY = 5;
const MAX_RETRIES = 3;

/**
 * Xóa toàn bộ folder trên Bunny Storage theo remotePath
 * Bunny hỗ trợ xóa folder bằng cách thêm dấu / ở cuối
 */
async function deleteFolder(remoteFolderPath) {
  const normalizedPath = remoteFolderPath.replace(/\\/g, '/').replace(/\/$/, '');
  const url = `${BASE_URL}/${normalizedPath}/`;

  try {
    await axios.delete(url, {
      headers: { AccessKey: ACCESS_KEY },
    });
    console.log(`[bunnyStorage] 🗑️  Đã xóa folder cũ: ${normalizedPath}`);
  } catch (error) {
    // 404 = folder chưa tồn tại → bỏ qua, không throw
    if (error.response?.status === 404) {
      console.log(`[bunnyStorage] ℹ️  Folder chưa tồn tại, bỏ qua xóa: ${normalizedPath}`);
      return;
    }
    console.error(`[bunnyStorage] ❌ Xóa folder thất bại: ${normalizedPath}`, error.message);
    throw error;
  }
}

/**
 * Upload 1 file lên Bunny Storage (có retry)
 */
async function uploadFile(localFilePath, remotePath) {
  const url = `${BASE_URL}/${remotePath.replace(/\\/g, '/')}`;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const fileStream = fs.createReadStream(localFilePath);

      await axios.put(url, fileStream, {
        headers: {
          AccessKey: ACCESS_KEY,
          'Content-Type': 'application/octet-stream',
        },
        maxBodyLength: Infinity,
      });

      return true;
    } catch (error) {
      const isLast = attempt === MAX_RETRIES;
      if (isLast) {
        console.error(`[bunnyStorage] ❌ Upload thất bại sau ${MAX_RETRIES} lần: ${remotePath}`);
        throw error;
      }
      console.warn(`[bunnyStorage] ⚠️ Retry ${attempt}/${MAX_RETRIES}: ${path.basename(localFilePath)}`);
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
}

/**
 * Thu thập tất cả file trong folder (đệ quy)
 */
function collectFiles(localFolderPath, remoteFolderPath) {
  const results = [];
  const entries = fs.readdirSync(localFolderPath);

  for (const entry of entries) {
    const localPath = path.join(localFolderPath, entry);
    const remotePath = `${remoteFolderPath}/${entry}`;

    if (fs.statSync(localPath).isDirectory()) {
      results.push(...collectFiles(localPath, remotePath));
    } else {
      results.push({ localPath, remotePath });
    }
  }

  return results;
}

/**
 * Xóa folder cũ trên Bunny rồi upload toàn bộ folder mới (song song, có retry)
 */
async function uploadFolder(localFolderPath, remoteFolderPath) {
  // Xóa folder cũ trước khi upload để tránh file thừa
  await deleteFolder(remoteFolderPath);

  const files = collectFiles(localFolderPath, remoteFolderPath);
  const total = files.length;

  console.log(`[bunnyStorage] Bắt đầu upload ${total} files (${CONCURRENCY} file song song)...`);

  let uploaded = 0;

  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY);

    await Promise.all(
      batch.map(async ({ localPath, remotePath }) => {
        await uploadFile(localPath, remotePath);
        uploaded++;
        process.stdout.write(`\r[bunnyStorage] Tiến độ: ${uploaded}/${total} files`);
      })
    );
  }

  console.log(`\n[bunnyStorage] ✅ Upload hoàn tất: ${total} files`);
}

module.exports = { uploadFile, uploadFolder, deleteFolder };