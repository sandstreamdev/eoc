const mongoose = require('mongoose');

const CommentSchema = require('./comment.model').schema;

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const ItemSchema = new Schema(
  {
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    comments: [CommentSchema],
    description: { type: String, default: '' },
    isOrdered: { type: Boolean, default: false },
    link: { type: String, default: '' },
    name: { type: String, required: true },
    purchaserId: { type: String },
    status: { type: String },
    voterIds: [ObjectId]
  },
  { timestamps: { createdAt: 'createdAt' } }
);

module.exports = mongoose.model('Item', ItemSchema);
