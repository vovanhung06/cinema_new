const { readJSON, writeJSON } = require('../utils/file');
const { JOB_FILE } = require('../config');

function getAllJobs() {
  const jobs = readJSON(JOB_FILE);
  console.log('[job.queue] getAllJobs ->', jobs.length, 'jobs');
  return jobs;
}

function getNextJob() {
  const jobs = readJSON(JOB_FILE);
  console.log('[job.queue] getNextJob read', jobs.length, 'jobs');
  if (jobs.length === 0) {
    return null;
  }

  const job = jobs.shift();
  writeJSON(JOB_FILE, jobs);

  console.log('[job.queue] dispatch job', job);
  return job;
}

module.exports = { getAllJobs, getNextJob };