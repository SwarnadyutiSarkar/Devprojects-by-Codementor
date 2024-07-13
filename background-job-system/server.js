const jobQueue = require('./queue');

jobQueue.process(5, async (job) => { // 5 concurrent jobs
  console.log(`Processing job with data: ${JSON.stringify(job.data)}`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.2) {
        resolve();
      } else {
        reject(new Error('Job failed'));
      }
    }, 1000);
  });
});

jobQueue.on('completed', (job) => {
  console.log(`Job with ID ${job.id} has been completed`);
});

jobQueue.on('failed', (job, err) => {
  console.log(`Job with ID ${job.id} has failed with error ${err.message}`);
  if (job.attemptsMade < 3) { // Retry up to 3 times
    job.retry();
  } else {
    console.log(`Job with ID ${job.id} has reached the retry limit`);
  }
});

console.log('Server is running and waiting for jobs');
