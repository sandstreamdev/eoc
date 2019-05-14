const mongoose = require('mongoose');

const {
  Types: { ObjectId }
} = mongoose;

const generateComments = listData => {
  const comments = [];
  for (let i = 0; i < listData.length; i += 1) {
    for (let j = 0; j < listData[i].itemIds.length; j += 1) {
      comments.push({
        _id: ObjectId(),
        authorId: listData[i].memberIds[0],
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
