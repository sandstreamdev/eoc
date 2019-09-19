const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const ItemSchema = new Schema(
  {
    authorId: { type: ObjectId, ref: 'User', required: true },
    description: { type: String, default: '' },
    done: { type: Boolean, default: false },
    editedBy: { type: ObjectId, ref: 'User' },
    isArchived: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    locks: {
      description: { type: Boolean, default: false },
      name: { type: Boolean, default: false }
    },
    name: { type: String, required: true },
    purchaserId: { type: String },
    status: { type: String },
    voterIds: [ObjectId]
  },
  { timestamps: { createdAt: 'createdAt' } }
);

module.exports = mongoose.model('Item', ItemSchema);
