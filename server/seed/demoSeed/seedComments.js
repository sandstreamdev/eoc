const Comment = require('../../models/comment.model');
const { generateComments } = require('./generateComments');

const seedComments = async listData => {
  const comments = generateComments(listData);

  const pendingComments = comments.map(comment => new Comment(comment).save());

  return Promise.all(pendingComments).then(() => comments);
};

module.exports = { seedComments };
