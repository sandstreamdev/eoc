const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const CohortSchema = new Schema(
  {
    description: { type: String },
    favIds: [ObjectId],
    isArchived: { type: Boolean, default: false },
    members: [{ type: ObjectId, ref: 'User' }],
    name: { type: String, required: true },
    owners: [{ type: ObjectId, ref: 'User' }]
  },
  { timestamps: { createdAt: 'createdAt' }, collection: 'cohorts' }
);

module.exports = mongoose.model('Cohort', CohortSchema);
