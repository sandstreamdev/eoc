const mongoose = require('mongoose');

const { Schema } = mongoose;

const CohortSchema = new Schema(
  {
    adminIds: { type: String },
    description: { type: String },
    memberIds: [String],
    name: { type: String, required: true },
    ownerId: { type: String }
  },
  { timestamps: { createdAt: 'createdAt' }, collection: 'cohorts' }
);

module.exports = mongoose.model('Cohort', CohortSchema);
