// server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const path = require('path');
require('dotenv').config();
require('./cronjobs'); // Import the cron jobs

const User = require('./user');
const Appointment = require('./appointment'); // Make sure you have an Appointment model

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Passport Configuration for Google and Facebook Login
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  let user = await User.findOne({ googleId: profile.id });
  if (!user) {
    user = new User({ googleId: profile.id, email: profile.emails[0].value });
    await user.save();
  }
  done(null, user);
}));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: '/auth/facebook/callback',
}, async (accessToken, refreshToken, profile, done) => {
  let user = await User.findOne({ facebookId: profile.id });
  if (!user) {
    user = new User({ facebookId: profile.id, email: profile.emails[0].value });
    await user.save();
  }
  done(null, user);
}));

app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
app.get('/auth/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.send({ token });
});

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { session: false }), (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.send({ token });
});

// User Registration and Login
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword });
  await user.save();
  res.status(201).send('User registered');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send('Invalid credentials');
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  res.send({ token });
});

// Middleware for protecting routes
const auth = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send('Invalid token.');
  }
};

// Admin Endpoints
app.post('/admin/slots', auth, async (req, res) => {
  const { date, slots } = req.body; // Assuming slots is an array of available time slots
  const appointments = slots.map(slot => ({ date: new Date(`${date}T${slot}`) }));
  await Appointment.insertMany(appointments);
  res.status(201).send('Time slots added');
});

app.get('/admin/appointments', auth, async (req, res) => {
  const appointments = await Appointment.find();
  res.send(appointments);
});

app.put('/admin/appointments/:id', auth, async (req, res) => {
  const { status } = req.body;
  await Appointment.findByIdAndUpdate(req.params.id, { status });
  res.send('Appointment status updated');
});

// Customer Endpoints
app.get('/customer/appointments', auth, async (req, res) => {
  const appointments = await Appointment.find({ customerEmail: req.user.email });
  res.send(appointments);
});

app.post('/customer/appointments', auth, async (req, res) => {
  const { date } = req.body;
  const appointment = new Appointment({ customerEmail: req.user.email, date });
  await appointment.save();
  res.status(201).send('Appointment scheduled');
});

app.put('/customer/appointments/:id', auth, async (req, res) => {
  const { date } = req.body;
  await Appointment.findByIdAndUpdate(req.params.id, { date });
  res.send('Appointment rescheduled');
});

app.delete('/customer/appointments/:id', auth, async (req, res) => {
  await Appointment.findByIdAndDelete(req.params.id);
  res.send('Appointment cancelled');
});

// Serve Static HTML File for Calendar
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
