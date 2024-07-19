const BackgroundJobClient = require('./client');
const BackgroundJobServer = require('./server');

const client = new BackgroundJobClient('redis://localhost:6379');
const server = new BackgroundJobServer('redis://localhost:6379', 5);

server.start();

client.pushJob({ type: 'send_email', data: { to: 'user@example.com', subject: 'Hello' } });
client.pushJob({ type: 'scrape_webpage', data: { url: 'https://example.com' } });