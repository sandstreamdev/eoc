const mongoose = require('mongoose');

const { EmailNotificationFrequency } = require('../common/variables');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    accessToken: { type: String },
    activatedAt: { type: Date },
    avatarUrl: { type: String },
    displayName: { type: String, required: true },
    email: { type: String, required: true },
    emailNotificationsFrequency: {
      type: String,
      default: EmailNotificationFrequency.NEVER
    },
    lastEmailNotificationSentAt: { type: Date, default: '' },
    idFromProvider: { type: String },
    isActive: { type: Boolean },
    name: { type: String },
    password: { type: String },
    provider: { type: String },
    resetToken: { type: String },
    resetTokenExpirationDate: { type: Date },
    signUpHash: { type: String },
    signUpHashExpirationDate: { type: Date },
    surname: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
