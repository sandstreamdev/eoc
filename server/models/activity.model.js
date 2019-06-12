const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const ActivitySchema = new Schema(
  {
    performerId: { type: ObjectId, ref: 'User', required: true },
    activityType: { type: String, required: true },
    cohortId: { type: ObjectId, ref: 'Cohort' },
    editedUserId: { type: ObjectId, ref: 'User' },
    editedValue: { type: String },
    itemId: { type: ObjectId, ref: 'Item' },
    listId: { type: ObjectId, ref: 'List' }
  },
  { timestamps: true, collection: 'activities' }
);

module.exports = mongoose.model('Activity', ActivitySchema);
