// user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    facebookId: { type: String, unique: true, sparse: true },
  });
  
  userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, email: this.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    return token;
  };


  

module.exports = mongoose.model('User', userSchema);
