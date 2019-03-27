const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const ItemSchema = require('./item.model').schema;

const ListSchema = new Schema(
  {
    ownerIds: [ObjectId],
    cohortId: {
      type: ObjectId,
      default: null
    },
    description: { type: String },
    favIds: [ObjectId],
    isArchived: { type: Boolean, default: false },
    items: [ItemSchema],
    name: { type: String, required: true },
    memberIds: [ObjectId],
    visibility: { type: String }
  },
  { timestamps: { createdAt: 'created_at' }, collection: 'lists' }
);

module.exports = mongoose.model('List', ListSchema);
