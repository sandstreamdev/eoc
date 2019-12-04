const mongoose = require('mongoose');

const { EmailReportsFrequency } = require('../common/variables');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    accessToken: { type: String },
    activatedAt: { type: Date },
    avatarUrl: { type: String },
    deleteToken: { type: String },
    deleteTokenExpirationDate: { type: Date },
    displayName: { type: String },
    email: { type: String, required: true },
    emailReportsFrequency: {
      type: String,
      default: EmailReportsFrequency.NEVER
    },
    idFromProvider: { type: String },
    isActive: { type: Boolean },
    lastEmailReportSentAt: { type: Date },
    password: { type: String },
    policyAccepted: { type: Boolean },
    policyAcceptedAt: { type: Date },
    provider: { type: String },
    resetToken: { type: String },
    resetTokenExpirationDate: { type: Date },
    signUpHash: { type: String },
    signUpHashExpirationDate: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
