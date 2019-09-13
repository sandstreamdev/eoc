const mongoose = require('mongoose');

const { Schema } = mongoose;

const SessionSchema = new Schema(
  {
    _id: { type: String },
    expires: { type: Date },
    session: { type: String },
    socketId: { type: String }
  },
  { collection: 'sessions' }
);

module.exports = mongoose.model('Session', SessionSchema);
