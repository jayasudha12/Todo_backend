const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true },
  githubId: { type: String, unique: true, sparse: true },
  facebookId: { type: String, unique: true, sparse: true },
  email: { type: String, sparse: true },
  password: { type: String },
  displayName: String,
  photo: String,
});

module.exports = mongoose.model('User', userSchema);
