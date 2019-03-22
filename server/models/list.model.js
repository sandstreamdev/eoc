const mongoose = require('mongoose');
const _map = require('lodash/map');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const ItemSchema = require('./item.model').schema;

const ListSchema = new Schema(
  {
    adminIds: [ObjectId],
    cohortId: {
      type: ObjectId,
      default: null
    },
    description: { type: String },
    favIds: [ObjectId],
    isArchived: { type: Boolean, default: false },
    items: [ItemSchema],
    name: { type: String, required: true },
    ordererIds: [ObjectId],
    purchaserIds: [ObjectId],
    visibility: { type: String }
  },
  { timestamps: { createdAt: 'created_at' }, collection: 'lists' }
);

ListSchema.method(
  'userVoted',
  (item, userId) => item.voterIds.indexOf(userId) > -1
);

ListSchema.method(
  'userMarkedAsFavourite',
  (list, userId) => list.favIds.indexOf(userId) > -1
);

ListSchema.method('responseWithItem', (item, listInstance, userId) => {
  const { voterIds, ...rest } = item.toObject();

  return {
    ...rest,
    isVoted: listInstance.userVoted(item, userId),
    votesCount: voterIds.length
  };
});

ListSchema.method('getListItems', (userId, listInstance, list) => {
  const { items } = list;

  return _map(items, item => {
    const { voterIds, ...rest } = item.toObject();
    return { ...rest, isVoted: listInstance.userVoted(item, userId) };
  });
});

module.exports = mongoose.model('List', ListSchema);
