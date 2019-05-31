const sanitize = require('mongo-sanitize');

const Comment = require('../models/comment.model');
const List = require('../models/list.model');
const {
  responseWithComment,
  responseWithComments
} = require('../common/utils/index');
const BadRequestException = require('../common/exceptions/BadRequestException');

const addComment = (req, resp) => {
  const { itemId, listId, text } = req.body;
  const {
    user: { _id: userId, avatarUrl, displayName }
  } = req;

  List.findOne({
    _id: sanitize(listId),
    memberIds: userId,
    'items._id': sanitize(itemId),
    'items.isOrdered': false
  })
    .exec()
    .then(list => {
      if (!list) {
        throw new BadRequestException();
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
        const { status } = err;

        return resp.status(status).send();
      }
      resp.sendStatus(400);
    });
};

const getComments = (req, resp) => {
  const { itemId, listId } = req.params;
  const {
    user: { _id: userId }
  } = req;
  const sanitizedItemId = sanitize(itemId);

  List.findOne({
    _id: sanitize(listId),
    viewersIds: userId,
    'items._id': sanitizedItemId
  })
    .exec()
    .then(list => {
      if (!list) {
        throw new BadRequestException();
      }

      return Comment.find(
        { itemId: sanitizedItemId },
        '_id itemId createdAt text',
        {
          sort: { createdAt: -1 }
        }
      )
        .populate('authorId', '_id avatarUrl displayName')
        .lean()
        .exec();
    })
    .then(comments => {
      if (!comments) {
        return resp.sendStatus(400);
      }

      resp.status(200).json(responseWithComments(comments));
    })
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { status, message } = err;

        return resp.status(status).send({ message });
      }

      resp.sendStatus(400);
    });
};

module.exports = {
  addComment,
  getComments
};
