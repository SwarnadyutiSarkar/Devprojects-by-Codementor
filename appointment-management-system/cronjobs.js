// cronjobs.js
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
require('dotenv').config();

const Appointment = require('./appointment'); // Make sure you have an Appointment model

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

cron.schedule('0 8 * * *', async () => {
  const appointments = await Appointment.find({ date: { $gte: new Date() } });
  appointments.forEach(appointment => {
    const mailOptions = {
      from: process.env.EMAIL,
      to: appointment.customerEmail,
      subject: 'Appointment Reminder',
      text: `You have an appointment scheduled on ${appointment.date}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  });
});

module.exports = transporter;
