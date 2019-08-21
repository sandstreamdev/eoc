const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const CohortSchema = new Schema(
  {
    description: { type: String },
    isArchived: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    locks: {
      description: { type: Boolean, default: false },
      name: { type: Boolean, default: false }
    },
    memberIds: [{ type: ObjectId, ref: 'User' }],
    name: { type: String, required: true },
    ownerIds: [{ type: ObjectId, ref: 'User' }]
  },
  { timestamps: { createdAt: 'createdAt' }, collection: 'cohorts' }
);

module.exports = mongoose.model('Cohort', CohortSchema);
