const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  googleId: { type: Number },
  displayName: { type: String, required: true }
});

module.exports = mongoose.model('User', UserSchema);
