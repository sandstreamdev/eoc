/* eslint-disable no-await-in-loop */
const Comment = require('../../models/comment.model');
const { generateComments } = require('./generateComments');

const seedComments = async listData => {
  const comments = generateComments(listData);

  // eslint-disable-next-line no-unused-vars
  let counter = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const comment of comments) {
    const newComment = new Comment(comment);

    await newComment.save();
    counter += 1;
  }
};

module.exports = { seedComments };
