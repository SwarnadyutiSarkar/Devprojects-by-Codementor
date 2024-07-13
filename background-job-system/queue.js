const Queue = require('bull');
const jobQueue = new Queue('jobQueue', 'redis://127.0.0.1:6379');

module.exports = jobQueue;
