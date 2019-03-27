const List = require('../models/list.model');
const Item = require('../models/item.model');
const {
  checkRole,
  filter,
  isValidMongoId,
  responseWithItems,
  responseWithItem,
  responseWithLists
} = require('../common/utils');
const Cohort = require('../models/cohort.model');
const NotFoundException = require('../common/exceptions/NotFoundException');

const createList = (req, resp) => {
  const { description, isPrivate, name, ownerId, cohortId } = req.body;

  const list = new List({
    cohortId,
    description,
    isPrivate,
    name,
    ownerIds: ownerId
  });

  list.save((err, doc) => {
    if (err) {
      return resp
        .status(400)
        .send({ message: 'List not saved. Please try again.' });
    }

    const { _id, description, isPrivate, name } = doc;
    const data = cohortId
      ? { _id, description, isPrivate, name, cohortId }
      : { _id, description, isPrivate, name };
    resp
      .status(201)
      .location(`/lists/${doc._id}`)
      .send(data);
  });
};

const deleteListById = (req, resp) => {
  List.findOneAndDelete(
    { _id: req.params.id, ownerIds: req.user._id },
    (err, doc) => {
      if (err) {
        return resp.status(400).send({
          message:
            'An error occurred while deleting the list. Please try again.'
        });
      }

      doc
        ? resp.status(200).send({
            message: `List "${doc.name}" successfully deleted.`
          })
        : resp.status(404).send({ message: 'List not found.' });
    }
  );
};

const getListsMetaData = (req, resp) => {
  const { cohortId } = req.params;
  const {
    user: { _id: userId }
  } = req;

  List.find(
    {
      cohortId,
      $or: [
        { ownerIds: req.user._id },
        { memberIds: req.user._id },
        { isPrivate: false }
      ],
      isArchived: false
    },
    `_id name description isPrivate favIds ${cohortId ? 'cohortId' : ''}`,
    { sort: { created_at: -1 } },
    (err, docs) => {
      if (err) {
        return resp.status(400).send({
          message:
            'An error occurred while fetching the lists data. Please try again.'
        });
      }

      docs
        ? resp.status(200).json(responseWithLists(docs, userId))
        : resp.status(404).send({ message: 'No lists data found.' });
    }
  );
};

const getArchivedListsMetaData = (req, resp) => {
  const { cohortId } = req.params;
  const {
    user: { _id: userId }
  } = req;
  List.find(
    {
      cohortId,
      $or: [
        { ownerIds: req.user._id },
        { memberIds: req.user._id },
        { isPrivate: false }
      ],
      isArchived: true
    },
    `_id name description isPrivate favIds isArchived ${
      cohortId ? 'cohortId' : ''
    }`,
    { sort: { created_at: -1 } },
    (err, docs) => {
      if (err) {
        return resp.status(400).send({
          message:
            'An error occurred while fetching the archived lists data. Please try again.'
        });
      }

      docs
        ? resp.status(200).json(responseWithLists(docs, userId))
        : resp.status(404).send({ message: 'No archived lists data found.' });
    }
  );
};

const addItemToList = (req, resp) => {
  const {
    item: { name, authorName, authorId },
    listId
  } = req.body;
  const {
    user: { _id: userId }
  } = req;

  const item = new Item({
    authorName,
    authorId,
    name
  });

  List.findOneAndUpdate(
    {
      _id: listId,
      $or: [
        { ownerIds: req.user._id },
        { memberIds: req.user._id },
        { isPrivate: false }
      ]
    },
    { $push: { items: item } },
    (err, doc) => {
      if (err) {
        return resp.status(400).send({
          message:
            'An error occurred while adding a new item. Please try again.'
        });
      }

      doc
        ? resp.status(200).send(responseWithItem(item, userId))
        : resp.status(404).send({ message: 'List  not found.' });
    }
  );
};

const getListData = (req, resp) => {
  const {
    params: { id: listId },
    user: { _id: userId }
  } = req;

  if (!isValidMongoId(listId)) {
    return resp
      .status(404)
      .send({ message: `Data of list id: ${listId} not found.` });
  }
  let list;
  List.findOne({
    _id: listId,
    $or: [{ ownerIds: userId }, { memberIds: userId }, { isPrivate: false }]
  })
    .exec()
    .then(doc => {
      if (!doc) {
        throw new NotFoundException(`Data of list id: ${listId} not found.`);
      }
      list = doc;
      const { cohortId } = list;
      if (cohortId) {
        return Cohort.findOne({ _id: cohortId })
          .exec()
          .then(cohort => {
            if (!cohort || cohort.isArchived) {
              throw new NotFoundException(
                `Data of list id: ${listId} not found.`
              );
            }
          });
      }
    })
    .then(() => {
      const {
        _id,
        cohortId,
        description,
        isArchived,
        isPrivate,
        name,
        ownerIds
      } = list;

      if (isArchived) {
        return resp
          .status(200)
          .json({ cohortId, _id, isArchived, isPrivate, name });
      }

      const isOwner = checkRole(ownerIds, req.user._id);
      const items = responseWithItems(userId, list);

      return resp.status(200).json({
        _id,
        cohortId,
        description,
        isOwner,
        isPrivate,
        isArchived,
        items,
        name
      });
    })
    .catch(err => {
      if (err instanceof NotFoundException) {
        const { status, message } = err;
        return resp.status(status).send({ message });
      }
      resp.status(400).send({
        message:
          'An error occurred while fetching the list data. Please try again.'
      });
    });
};

const updateListItem = (req, resp) => {
  const { isOrdered, itemId } = req.body;
  const { id: listId } = req.params;
  const {
    user: { _id: userId }
  } = req;

  /**
   * Create object with properties to update, but only these which
   * are passed in the request
   *  */
  const propertiesToUpdate = {};
  if (isOrdered !== undefined) {
    propertiesToUpdate['items.$.isOrdered'] = isOrdered;
  }

  List.findOneAndUpdate(
    {
      _id: listId,
      'items._id': itemId,
      $or: [
        { ownerIds: req.user._id },
        { memberIds: req.user._id },
        { isPrivate: false }
      ]
    },
    {
      $set: propertiesToUpdate
    },
    { new: true },
    (err, doc) => {
      if (err) {
        return resp.status(400).send({
          message:
            'An error occurred while updating the list data. Please try again.'
        });
      }
      const itemIndex = doc.items.findIndex(item => item._id.equals(itemId));
      const item = doc.items[itemIndex];

      doc
        ? resp.status(200).json(responseWithItem(item, userId))
        : resp.status(404).send({ message: 'List data not found.' });
    }
  );
};

const voteForItem = (req, resp) => {
  const { itemId } = req.body;
  const { id: listId } = req.params;
  const {
    user: { _id: userId }
  } = req;

  List.findOneAndUpdate(
    {
      _id: listId,
      'items._id': itemId,
      $or: [
        { ownerIds: req.user._id },
        { memberIds: req.user._id },
        { isPrivate: false }
      ]
    },
    { $push: { 'items.$.voterIds': req.user._id } },
    { new: true },
    (err, doc) => {
      if (err) {
        return resp.status(400).send({
          message: 'An error occurred while voting. Please try again.'
        });
      }
      const itemIndex = doc.items.findIndex(item => item._id.equals(itemId));
      const item = doc.items[itemIndex];

      doc
        ? resp.status(200).json(responseWithItem(item, userId))
        : resp.status(404).send({ message: 'List data not found.' });
    }
  );
};

const clearVote = (req, resp) => {
  const { itemId } = req.body;
  const { id: listId } = req.params;
  const {
    user: { _id: userId }
  } = req;

  List.findOneAndUpdate(
    {
      _id: listId,
      'items._id': itemId,
      $or: [
        { ownerIds: req.user._id },
        { memberIds: req.user._id },
        { isPrivate: false }
      ]
    },
    { $pull: { 'items.$.voterIds': req.user._id } },
    { new: true },
    (err, doc) => {
      if (err) {
        return resp.status(400).send({
          message: 'An error occurred while voting. Please try again.'
        });
      }
      const itemIndex = doc.items.findIndex(item => item._id.equals(itemId));
      const item = doc.items[itemIndex];

      doc
        ? resp.status(200).json(responseWithItem(item, userId))
        : resp.status(404).send({ message: 'List data not found.' });
    }
  );
};

const updateListById = (req, resp) => {
  const { description, isArchived, name } = req.body;
  const { id: listId } = req.params;
  const dataToUpdate = filter(x => x !== undefined)({
    description,
    isArchived,
    name
  });

  List.findOneAndUpdate(
    {
      _id: listId,
      $or: [{ ownerIds: req.user._id }]
    },
    dataToUpdate,
    (err, doc) => {
      if (err) {
        return resp.status(400).send({
          message:
            'An error occurred while updating the list data. Please try again.'
        });
      }

      doc
        ? resp
            .status(200)
            .send({ message: `List "${name}" successfully updated.` })
        : resp.status(404).send({ message: 'List data not found.' });
    }
  );
};

const addToFavourites = (req, resp) => {
  const { id: listId } = req.params;

  List.findOneAndUpdate(
    {
      _id: listId,
      $or: [
        { ownerIds: req.user._id },
        { memberIds: req.user._id },
        { isPrivate: false }
      ]
    },
    {
      $push: { favIds: req.user._id }
    },
    (err, doc) => {
      if (err) {
        return resp.status(400).send({
          message: "Can't mark list as favourite. Please try again."
        });
      }

      doc
        ? resp.status(200).send({
            message: `List "${doc.name}" successfully marked as favourite.`
          })
        : resp.status(404).send({ message: 'List data not found.' });
    }
  );
};

const removeFromFavourites = (req, resp) => {
  const { id: listId } = req.params;

  List.findOneAndUpdate(
    {
      _id: listId,
      $or: [
        { ownerIds: req.user._id },
        { memberIds: req.user._id },
        { isPrivate: false }
      ]
    },
    {
      $pull: { favIds: req.user._id }
    },
    (err, doc) => {
      if (err) {
        return resp.status(400).send({
          message: "Can't remove list from favourites. Please try again."
        });
      }

      doc
        ? resp.status(200).send({
            message: `List "${doc.name}" successfully removed from favourites.`
          })
        : resp.status(404).send({ message: 'List data not found.' });
    }
  );
};

module.exports = {
  addItemToList,
  addToFavourites,
  clearVote,
  createList,
  deleteListById,
  getArchivedListsMetaData,
  getListData,
  getListsMetaData,
  removeFromFavourites,
  updateListById,
  updateListItem,
  voteForItem
};
