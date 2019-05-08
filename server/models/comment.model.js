const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const CommentSchema = new Schema(
  {
    authorId: { type: ObjectId, ref: 'User', required: true },
    itemId: { type: ObjectId, ref: 'Item', required: true },
    listIdId: { type: ObjectId, ref: 'List', required: true },
    text: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', CommentSchema);
