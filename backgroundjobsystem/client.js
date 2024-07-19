// client.js
const redis = require('redis');

class BackgroundJobClient {
  constructor(redisUrl) {
    this.redis = redis.createClient({ url: redisUrl });
  }

  async pushJob(job) {
    if (job.scheduledAt) {
      job.scheduledAt = Math.max(job.scheduledAt, Date.now() + 1000); // ensure scheduledAt is at least 1 second in the future
    }
    await this.redis.lpush('jobs', JSON.stringify(job));
  }
}

module.exports = BackgroundJobClient;