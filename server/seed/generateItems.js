const mongoose = require('mongoose');

const {
  Types: { ObjectId }
} = mongoose;

const generateItems = userId => itemsCount => {
  const items = [];

  for (let i = 0; i < itemsCount; i += 1) {
    items.push({
      _id: ObjectId(),
      authorId: userId,
      authorName: 'Adam',
      description: '',
      isArchived: false,
      isDeleted: false,
      isOrdered: false,
      locks: {
        description: false,
        name: false
      },
      name: `item ${i}`,
      purchaserId: '',
      voterIds: []
    });
  }

  return items;
};

module.exports = generateItems;
