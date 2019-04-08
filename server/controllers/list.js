const List = require('../models/list.model');
const Item = require('../models/item.model');
const {
  checkIfCohortMember,
  checkRole,
  filter,
  isValidMongoId,
  responseWithItems,
  responseWithItem,
  responseWithLists,
  uniqueMembers
} = require('../common/utils');
const Cohort = require('../models/cohort.model');
const NotFoundException = require('../common/exceptions/NotFoundException');
const BadRequestException = require('../common/exceptions/BadRequestException');
const User = require('../models/user.model');
const {
  responseWithListMember,
  responseWithListMembers
} = require('../common/utils/index');

const createList = (req, resp) => {
  const { description, isListPrivate, name, userId, cohortId } = req.body;

  const list = new List({
    cohortId,
    description,
    isPrivate: isListPrivate,
    name,
    ownerIds: userId
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
    .populate('memberIds', 'avatarUrl displayName _id')
    .populate('ownerIds', 'avatarUrl displayName _id')
    .exec()
    .then(doc => {
      if (!doc) {
        throw new NotFoundException(`Data of list id: ${listId} not found.`);
      }

      list = doc;
      const { cohortId } = list;

      if (cohortId) {
        return Cohort.findOne({ _id: cohortId })
          .populate('memberIds', 'avatarUrl displayName _id')
          .populate('ownerIds', 'avatarUrl displayName _id')
          .exec()
          .then(cohort => {
            if (!cohort || cohort.isArchived) {
              throw new NotFoundException(
                `Data of list id: ${listId} not found.`
              );
            }

            const { memberIds, ownerIds } = cohort;
            return [...memberIds, ...ownerIds];
          });
      }
    })
    .then(cohortMembers => {
      const {
        _id,
        cohortId,
        description,
        isArchived,
        isPrivate,
        memberIds,
        name,
        ownerIds
      } = list;

      if (isArchived) {
        return resp
          .status(200)
          .json({ cohortId, _id, isArchived, isPrivate, name });
      }

      const allMembers = isPrivate
        ? [...memberIds, ...ownerIds]
        : uniqueMembers(cohortMembers, [...memberIds, ...ownerIds]);

      const owners = ownerIds.map(owner => owner.id);
      const members = responseWithListMembers(
        allMembers,
        owners,
        cohortMembers
      );

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
        members,
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

const removeOwner = (req, resp) => {
  const { id: listId } = req.params;
  const { userId } = req.body;
  const {
    user: { _id: ownerId }
  } = req;

  List.findOneAndUpdate(
    { _id: listId, ownerIds: { $all: [ownerId, userId] } },
    { $pull: { ownerIds: userId } },
    (err, doc) => {
      if (err) {
        return resp.status(400).send({
          message: "Can't remove owner from list."
        });
      }

      if (doc) {
        return resp.status(200).send({
          message: 'Owner successfully removed from list.'
        });
      }

      resp.status(404).send({ message: 'List data not found.' });
    }
  );
};

const removeMember = (req, resp) => {
  const { id: listId } = req.params;
  const { userId } = req.body;
  const {
    user: { _id: ownerId }
  } = req;

  List.findOneAndUpdate(
    { _id: listId, ownerIds: ownerId, memberIds: userId },
    { $pull: { memberIds: userId } },
    (err, doc) => {
      if (err) {
        return resp.status(400).send({
          message: "Can't remove member from list."
        });
      }

      if (doc) {
        return resp.status(200).send({
          message: 'Member successfully removed from list.'
        });
      }

      resp.status(404).send({ message: 'List data not found.' });
    }
  );
};

const changeToOwner = (req, resp) => {
  const { id: listId } = req.params;
  const { userId } = req.body;

  const {
    user: { _id: ownerId }
  } = req;

  List.findOne({ _id: listId, ownerIds: ownerId })
    .populate('cohortId', 'memberIds ownerIds')
    .exec()
    .then(doc => {
      if (!doc) {
        throw new BadRequestException("Can't set user as a list's owner.");
      }

      const { cohortId: cohort, isPrivate, memberIds } = doc;
      const isCohortMember = checkIfCohortMember(cohort, userId);

      if (isPrivate || !isCohortMember) {
        doc.memberIds.splice(memberIds.indexOf(userId), 1);
      }

      doc.ownerIds.push(userId);
      return doc.save();
    })
    .then(() => {
      resp.status(200).send({
        message: "User has been successfully set as a list's owner."
      });
    })
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { status, message } = err;
        return resp.status(status).send({ message });
      }

      resp.status(400).send({ message: 'List data not found' });
    });
};

const changeToMember = (req, resp) => {
  const { id: listId } = req.params;
  const { userId } = req.body;
  const {
    user: { _id: ownerId }
  } = req;
  List.findOne({ _id: listId, ownerIds: { $all: [ownerId, userId] } })
    .populate('cohortId', 'memberIds ownerIds')
    .exec()
    .then(doc => {
      if (!doc) {
        throw new BadRequestException("Can't set user as a list's member.");
      }

      const { cohortId: cohort, isPrivate, ownerIds } = doc;
      const isCohortMember = checkIfCohortMember(cohort, userId);

      if (isPrivate || !isCohortMember) {
        doc.memberIds.push(userId);
      }

      doc.ownerIds.splice(ownerIds.indexOf(userId), 1);
      return doc.save();
    })
    .then(() => {
      resp.status(200).send({
        message: "User has been successfully set as a list's member."
      });
    })
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { status, message } = err;
        return resp.status(status).send({ message });
      }

      resp.status(400).send({
        message: 'List data not found'
      });
    });
};

const addMember = (req, resp) => {
  const {
    user: { _id: currentUser }
  } = req;
  const { id: listId } = req.params;
  const { email } = req.body;

  List.findOne({ _id: listId, $or: [{ ownerIds: currentUser }] })
    .populate('cohortId', 'memberIds ownerIds')
    .exec()
    .then(doc => {
      if (doc) {
        const { cohortId: cohort, ownerIds } = doc;

        return User.findOne({ email })
          .exec()
          .then(doc => {
            const { _id, avatarUrl, displayName } = doc;
            return { _id, avatarUrl, cohort, displayName, ownerIds };
          })
          .catch(() =>
            resp.status(400).send({ message: 'User data not found.' })
          );
      }

      return resp
        .status(400)
        .send({ message: "You don't have permission to add new member" });
    })
    .then(data => {
      const {
        _id: newMemberId,
        cohort,
        displayName,
        avatarUrl,
        ownerIds
      } = data;

      List.findOneAndUpdate(
        { _id: listId, memberIds: { $nin: [newMemberId] } },
        { $push: { memberIds: newMemberId } }
      )
        .exec()
        .then(doc => {
          if (doc) {
            const data = { avatarUrl, displayName, newMemberId };
            const dataToSend = responseWithListMember(data, ownerIds, cohort);
            return resp.status(200).json(dataToSend);
          }

          return resp
            .status(400)
            .send({ message: 'User is already a member.' });
        })
        .catch(() => {
          throw new NotFoundException('List data not found.');
        });
    })
    .catch(err => {
      if (err instanceof NotFoundException) {
        const { status, message } = err;
        return resp.status(status).send({ message });
      }

      resp.status(400).send({
        message: 'An error occurred while adding new member. Please try again.'
      });
    });
};

module.exports = {
  addItemToList,
  addMember,
  addToFavourites,
  changeToMember,
  changeToOwner,
  clearVote,
  createList,
  deleteListById,
  getArchivedListsMetaData,
  getListData,
  getListsMetaData,
  removeFromFavourites,
  removeMember,
  removeOwner,
  updateListById,
  updateListItem,
  voteForItem
};
