const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
// const Users = require('../models/user.model');

const CohortSchema = new Schema(
  {
    description: { type: String },
    favIds: [ObjectId],
    isArchived: { type: Boolean, default: false },
    memberIds: [{ type: ObjectId, ref: 'User' }],
    name: { type: String, required: true },
    ownerIds: [{ type: ObjectId, ref: 'User' }]
  },
  { timestamps: { createdAt: 'createdAt' }, collection: 'cohorts' }
);

module.exports = mongoose.model('Cohort', CohortSchema);
