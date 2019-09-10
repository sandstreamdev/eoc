const mongoose = require('mongoose');

const {
  Types: { ObjectId }
} = mongoose;

const generateComments = listData => {
  const comments = [];
  const listsCount = listData.length;

  for (let i = 0; i < listsCount; i += 1) {
    const itemsCount = listData[i].itemIds.length;

    for (let j = 0; j < itemsCount; j += 1) {
      comments.push({
        _id: ObjectId(),
        authorId: listData[i].memberIds[0],
        isDeleted: false,
        itemId: listData[i].itemIds[j],
        listId: listData[i].id,
        text:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a mollis eros, in mollis elit.'
      });
    }
  }

  return comments;
};

module.exports = { generateComments };
