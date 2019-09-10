const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const ItemSchema = require('./item.model').schema;
const { ListType } = require('../common/variables');

const ListSchema = new Schema(
  {
    cohortId: { type: ObjectId, default: null, ref: 'Cohort' },
    description: { type: String },
    favIds: [ObjectId],
    isArchived: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    items: [ItemSchema],
    locks: {
      description: { type: Boolean, default: false },
      name: { type: Boolean, default: false }
    },
    memberIds: [{ type: ObjectId, ref: 'User' }],
    name: { type: String, required: true },
    ownerIds: [{ type: ObjectId, ref: 'User' }],
    type: { type: String, default: ListType.LIMITED },
    viewersIds: [{ type: ObjectId, ref: 'User' }]
  },
  { timestamps: { createdAt: 'created_at' }, collection: 'lists' }
);

module.exports = mongoose.model('List', ListSchema);
