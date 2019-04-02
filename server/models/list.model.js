const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const ItemSchema = require('./item.model').schema;

const ListSchema = new Schema(
  {
    cohortId: { type: ObjectId, default: null },
    description: { type: String },
    favIds: [ObjectId],
    isArchived: { type: Boolean, default: false },
    isPrivate: { type: Boolean, default: true },
    items: [ItemSchema],
    memberIds: [{ type: ObjectId, ref: 'User' }],
    name: { type: String, required: true },
    ownerIds: [{ type: ObjectId, ref: 'User' }],
    visibility: { type: String }
  },
  { timestamps: { createdAt: 'created_at' }, collection: 'lists' }
);

module.exports = mongoose.model('List', ListSchema);
