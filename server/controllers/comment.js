const sanitize = require('mongo-sanitize');

const Comment = require('../models/comment.model');
const List = require('../models/list.model');
const { responseWithComment } = require('../common/utils/index');
const BadRequestException = require('../common/exceptions/BadRequestException');

const addComment = (req, resp) => {
  const { itemId, listId, text } = req.body;
  const {
    user: { _id: userId, avatarUrl, displayName }
  } = req;

  List.findOne({
    _id: sanitize(listId),
    memberIds: sanitize(userId),
    'items._id': sanitize(itemId)
  })
    .exec()
    .then(list => {
      if (!list) {
        throw new BadRequestException('List data not found.');
      }

      const comment = new Comment({
        authorId: userId,
        itemId,
        listId,
        text
      });

      return comment.save();
    })
    .then(comment =>
      resp
        .location(`/comment/${comment._id}`)
        .status(201)
        .send(responseWithComment(comment, avatarUrl, displayName))
    )
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { status, message } = err;

        return resp.status(status).send({ message });
      }
      resp
        .status(400)
        .send({ message: 'Comment not saved. Please try again.' });
    });
};

module.exports = {
  addComment
};
