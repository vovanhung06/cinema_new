const axios = require('axios');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const STORAGE_ZONE_NAME = process.env.BUNNY_STORAGE_ZONE_NAME;
const ACCESS_KEY = process.env.BUNNY_STORAGE_ACCESS_KEY;
const BASE_URL = `https://sg.storage.bunnycdn.com/${STORAGE_ZONE_NAME}`;

/**
 * Upload a single file to Bunny Storage
 */
async function uploadFile(localFilePath, remotePath) {
  try {
    const fileStream = fs.createReadStream(localFilePath);
    const url = `${BASE_URL}/${remotePath}`;

    console.log(`[bunnyStorage] Uploading ${localFilePath} to ${url}`);

    await axios.put(url, fileStream, {
      headers: {
        AccessKey: ACCESS_KEY,
        'Content-Type': 'application/octet-stream',
      },
      maxBodyLength: Infinity,
    });

    return true;
  } catch (error) {
    console.error(`[bunnyStorage] Error uploading ${localFilePath}:`, error.response?.data || error.message);
    throw error;
  }
}

/**
 * Recursively upload a folder to Bunny Storage
 */
async function uploadFolder(localFolderPath, remoteFolderPath) {
  const files = fs.readdirSync(localFolderPath);

  for (const file of files) {
    const localPath = path.join(localFolderPath, file);
    const remotePath = path.join(remoteFolderPath, file);

    if (fs.statSync(localPath).isDirectory()) {
      await uploadFolder(localPath, remotePath);
    } else {
      await uploadFile(localPath, remotePath);
    }
  }
}

module.exports = {
  uploadFile,
  uploadFolder
};
