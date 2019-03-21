const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const ItemSchema = new Schema(
  {
    authorName: { type: String, required: true },
    authorId: { type: String, required: true },
    comment: { type: String },
    isOrdered: { type: Boolean, default: false },
    name: { type: String, required: true },
    purchaserId: { type: String },
    status: { type: String },
    voterIds: [ObjectId],
    votesCount: { type: Number, default: 0 }
  },
  { timestamps: { createdAt: 'createdAt' } }
);

module.exports = mongoose.model('Item', ItemSchema);
