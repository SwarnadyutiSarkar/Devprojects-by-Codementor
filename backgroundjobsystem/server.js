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
        this.executeJob(jobData);
      }
    });
  }

  async executeJob(job) {
    const worker = this.workers.find((worker) => worker.available);
    if (!worker) {
      console.log('No available workers');
      return;
    }

    worker.available = false;
    worker.postMessage(job);

    worker.on('message', (result) => {
      if (result.error) {
        console.error(`Job failed: ${result.error}`);
        this.retryJob(job);
      } else {
        console.log(`Job completed: ${result.result}`);
      }
      worker.available = true;
    });
  }

  async retryJob(job) {
    if (job.retries < 3) {
      job.retries++;
      await this.redis.lpush('jobs', JSON.stringify(job));
    } else {
      console.log(`Job failed after ${job.retries} retries`);
    }
  }
}

module.exports = BackgroundJobServer;