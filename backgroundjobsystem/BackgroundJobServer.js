// server.js
const redis = require('redis');
const { Worker } = require('worker_threads');

class BackgroundJobServer {
  constructor(redisUrl, concurrencyLimit) {
    this.redis = redis.createClient({ url: redisUrl });
    this.concurrencyLimit = concurrencyLimit;
    this.workers = [];
  }

  async start() {
    for (let i = 0; i < this.concurrencyLimit; i++) {
      this.workers.push(new Worker('./worker.js'));
    }

    this.redis.brpop('jobs', (err, job) => {
      if (err) {
        console.error(err);
      } else {
        const jobData = JSON.parse(job);
        if (jobData.scheduledAt && jobData.scheduledAt > Date.now()) {
          // Job is scheduled for later, put it back in the queue
          this.redis.lpush('jobs', JSON.stringify(jobData));
          setTimeout(() => {
            this.redis.lpush('jobs', JSON.stringify(jobData));
          }, jobData.scheduledAt - Date.now());
        } else {
          this.executeJob(jobData);
        }
      }
    });
  }

  async executeJob(job) {
    try {
      const result = await this.executeJobInternal(job);
      console.log(`Job completed: ${result}`);
    } catch (error) {
      console.error(`Job failed: ${error}`);
      this.handleError(job, error);
    }
  }

  async handleError(job, error) {
    if (job.retries < 3) {
      job.retries++;
      await this.redis.lpush('jobs', JSON.stringify(job));
    } else {
      console.log(`Job failed after ${job.retries} retries`);
      // Send an email or notification to the developer
      await this.sendErrorNotification(job, error);
    }
  }

  async sendErrorNotification(job, error) {
    // Implement the logic to send an email or notification to the developer
    console.log(`Sending error notification for job ${job.type}`);
  }
}
async executeJob(job) {
    if (job.priority > 0) {
      // High-priority job, execute it immediately
      try {
        const result = await this.executeJobInternal(job);
        console.log(`Job completed: ${result}`);
      } catch (error) {
        console.error(`Job failed: ${error}`);
        this.handleError(job, error);
      }
    } else {
      // Low-priority job, put it in a separate queue
      this.redis.lpush('low-priority-jobs', JSON.stringify(job));
      setTimeout(() => {
        this.redis.lpush('jobs', JSON.stringify(job));
      }, 1000); // execute low-priority jobs after 1

module.exports = BackgroundJobServer;