const sanitize = require('mongo-sanitize');

const Comment = require('../models/comment.model');
const List = require('../models/list.model');
const {
  responseWithComment,
  responseWithComments,
  returnPayload
} = require('../common/utils/index');
const BadRequestException = require('../common/exceptions/BadRequestException');
const { saveActivity } = require('./activity');
const { ActivityType } = require('../common/variables');
const socketActions = require('../sockets/list');
const socketInstance = require('../sockets/index').getSocketInstance();

const addComment = (req, resp) => {
  const { itemId, listId, text } = req.body;
  const {
    user: { _id: userId, avatarUrl, displayName }
  } = req;
  const sanitizedItemId = sanitize(itemId);
  const sanitizedListId = sanitize(listId);
  let list;

  List.findOne({
    _id: sanitizedListId,
    memberIds: userId,
    'items._id': sanitizedItemId,
    'items.isOrdered': false
  })
    .exec()
    .then(doc => {
      if (!doc) {
        throw new BadRequestException();
      }
      list = doc;

      const comment = new Comment({
        authorId: userId,
        itemId: sanitizedItemId,
        listId: sanitizedListId,
        text
      });

      return comment.save();
    })
    .then(comment => {
      const commentToSend = responseWithComment(
        comment,
        avatarUrl,
        displayName
      );
      const data = { itemId, listId, comment: commentToSend };

      return returnPayload(socketActions.addComment(socketInstance)(data))(
        commentToSend
      );
    })
    .then(payload => {
      resp
        .location(`/comment/${payload._id}`)
        .status(201)
        .send(payload);

      saveActivity(
        ActivityType.ITEM_ADD_COMMENT,
        userId,
        sanitizedItemId,
        sanitizedListId,
        list.cohortId
      );
    })
    .catch(() => resp.sendStatus(400));
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

      resp.send(responseWithComments(comments));
    })
    .catch(() => resp.sendStatus(400));
};

module.exports = {
  addComment,
  getComments
};
