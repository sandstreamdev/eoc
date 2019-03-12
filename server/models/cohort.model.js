const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const CohortSchema = new Schema(
  {
    adminIds: [ObjectId],
    description: { type: String },
    isArchived: { type: Boolean, default: false },
    memberIds: [ObjectId],
    name: { type: String, required: true }
  },
  { timestamps: { createdAt: 'createdAt' }, collection: 'cohorts' }
);

module.exports = mongoose.model('Cohort', CohortSchema);
