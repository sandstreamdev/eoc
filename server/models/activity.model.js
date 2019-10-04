const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const ActivitySchema = new Schema(
  {
    performerId: { type: ObjectId, ref: 'User', required: true },
    activityType: { type: String, required: true },
    cohortId: { type: ObjectId, ref: 'Cohort', default: null },
    editedUserId: { type: ObjectId, ref: 'User', default: null },
    editedValue: { type: String, default: null },
    itemId: { type: ObjectId, ref: 'Item', default: null },
    listId: { type: ObjectId, ref: 'List', default: null }
  },
  { timestamps: true, collection: 'activities' }
);

module.exports = mongoose.model('Activity', ActivitySchema);
