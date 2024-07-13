const express = require('express');
const jobQueue = require('./queue');
const app = express();

app.use(express.json());

app.post('/add-job', async (req, res) => {
  const { jobData } = req.body;
  await jobQueue.add(jobData);
  res.status(200).send('Job added to the queue');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Client running on port ${port}`);
});
