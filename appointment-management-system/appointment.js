// appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  customerEmail: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['scheduled', 'confirmed', 'paid', 'cancelled'], default: 'scheduled' },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
