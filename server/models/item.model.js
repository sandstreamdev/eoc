const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const ItemSchema = new Schema(
  {
    authorId: { type: ObjectId, ref: 'User', required: true },
    description: { type: String, default: '' },
    isArchived: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isOrdered: { type: Boolean, default: false },
    name: { type: String, required: true },
    purchaserId: { type: String },
    status: { type: String },
    voterIds: [ObjectId]
  },
  { timestamps: { createdAt: 'createdAt' } }
);

module.exports = mongoose.model('Item', ItemSchema);
