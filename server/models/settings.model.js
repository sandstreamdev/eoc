const mongoose = require('mongoose');

const { ViewType } = require('../common/variables');

const { Schema } = mongoose;

const SettingsSchema = new Schema(
  {
    viewType: { type: String, default: ViewType.LIST }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', SettingsSchema);
