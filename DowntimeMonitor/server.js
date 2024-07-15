const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = 'mongodb://localhost:27017/downtime_monitor';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Define Schema and Model for monitored websites
const websiteSchema = new mongoose.Schema({
    name: String,
    url: String,
    status: Number, // HTTP status code
    lastChecked: Date,
    uptime: Number, // In minutes
});
const Website = mongoose.model('Website', websiteSchema);

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
// Add a new website to monitor
app.post('/api/websites', async (req, res) => {
    const { name, url } = req.body;
    try {
        const website = await Website.create({ name, url, status: null, lastChecked: null, uptime: 0 });
        res.status(201).json(website);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Monitor all websites every 30 minutes
cron.schedule('*/30 * * * *', async () => {
    const websites = await Website.find();
    websites.forEach(async (website) => {
        try {
            const response = await axios.get(website.url);
            website.status = response.status;
            website.lastChecked = new Date();
            website.uptime += 30; // Assuming cron runs every 30 minutes
            await website.save();
            if (response.status !== 200) {
                // Implement alert mechanism (e.g., send email or SMS)
                console.log(`Alert: ${website.name} is down!`);
            }
        } catch (err) {
            console.error(`Error checking ${website.name}: ${err.message}`);
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
