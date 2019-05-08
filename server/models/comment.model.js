const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const CommentSchema = new Schema(
  {
    authorId: { type: ObjectId, ref: 'User', required: true },
    text: { type: String, required: true }
    // itemId: { type: ObjectId, ref: 'Item', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', CommentSchema);
