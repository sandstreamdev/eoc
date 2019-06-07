const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const ActivitySchema = new Schema(
  {
    actorId: { type: ObjectId, ref: 'User', required: true },
    activityType: { type: String, required: true },
    itemId: { type: ObjectId },
    listId: { type: ObjectId, ref: 'List' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Activity', ActivitySchema);
