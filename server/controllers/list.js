const List = require('../models/list.model');
const Item = require('../models/item.model');
const {
  checkIfGuest,
  checkIfArrayContainsUserId,
  filter,
  isValidMongoId,
  responseWithItems,
  responseWithItem,
  responseWithList,
  responseWithLists
} = require('../common/utils');
const Cohort = require('../models/cohort.model');
const NotFoundException = require('../common/exceptions/NotFoundException');
const BadRequestException = require('../common/exceptions/BadRequestException');
const User = require('../models/user.model');
const {
  responseWithListMember,
  responseWithListMembers
} = require('../common/utils/index');
const { updateSubdocumentFields } = require('../common/utils/helpers');
const { ListType } = require('../common/variables');

const createList = (req, resp) => {
  const { cohortId, description, name, type } = req.body;
  const {
    user: { _id: userId }
  } = req;

  const list = new List({
    cohortId,
    description,
    memberIds: userId,
    name,
    ownerIds: userId,
    type,
    viewersIds: userId
  });

  if (cohortId && type === ListType.SHARED) {
    Cohort.findOne({ _id: cohortId })
      .exec()
      .then(cohort => {
        const { memberIds } = cohort;

        if (checkIfArrayContainsUserId(memberIds, userId)) {
          list.viewersIds = memberIds;

          return list.save();
        }

        throw new BadRequestException(
          'You need to be cohort member to create new lists'
        );
      })
      .then(() =>
        resp
          .status(201)
          .location(`/lists/${list._id}`)
          .send(responseWithList(list, userId))
      )
      .catch(err => {
        if (err instanceof BadRequestException) {
          const { status, message } = err;

          return resp.status(status).send({ message });
        }
        resp.status(400).send({ message: 'List not saved. Please try again.' });
      });
  } else {
    list
      .save()
      .then(() =>
        resp
          .status(201)
          .location(`/lists/${list._id}`)
          .send(responseWithList(list, userId))
      )
      .catch(() => {
        resp.status(400).send({ message: 'List not saved. Please try again.' });
      });
  }
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

  const query = {
    viewersIds: userId,
    isArchived: false
  };

  if (cohortId) {
    query.cohortId = cohortId;
  }

  List.find(
    query,
    '_id name description type items favIds cohortId',
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

  const query = {
    $or: [{ ownerIds: userId }, { memberIds: userId }],
    isArchived: true
  };

  if (cohortId) {
    query.cohortId = cohortId;
  }

  List.find(
    query,
    `_id name description type items favIds isArchived ${
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
      memberIds: userId
    },
    { $push: { items: item } },
    { new: true },
    (err, doc) => {
      if (err) {
        return resp.status(400).send({
          message:
            'An error occurred while adding a new item. Please try again.'
        });
      }

      if (!doc) {
        return resp
          .status(400)
          .send({ message: "You don't have permissions to add new item" });
      }

      const { items } = doc;
      const newItem = items && items.slice(-1)[0];

      resp.status(200).send(responseWithItem(newItem, userId));
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
    viewersIds: userId
  })
    .populate('viewersIds', 'avatarUrl displayName _id')
    .exec()
    .then(doc => {
      if (!doc) {
        throw new NotFoundException(`Data of list id: ${listId} not found.`);
      }

      list = doc;
      const { cohortId } = list;

      if (cohortId) {
        return Cohort.findOne({ _id: cohortId }).exec();
      }
    })
    .then(cohort => (cohort ? cohort.memberIds : []))
    .then(cohortMembers => {
      const {
        _id,
        cohortId,
        description,
        isArchived,
        memberIds,
        name,
        ownerIds,
        type,
        viewersIds: viewersCollection
      } = list;

      if (isArchived) {
        return resp.status(200).json({ cohortId, _id, isArchived, name, type });
      }

      const members = responseWithListMembers(
        viewersCollection,
        memberIds,
        ownerIds,
        cohortMembers
      );

      const isGuest = checkIfGuest(cohortMembers, userId);
      const isMember = checkIfArrayContainsUserId(memberIds, userId);
      const isOwner = checkIfArrayContainsUserId(ownerIds, userId);
      const items = responseWithItems(userId, list);

      return resp.status(200).json({
        _id,
        cohortId,
        description,
        isArchived,
        isGuest,
        isMember,
        isOwner,
        items,
        members,
        name,
        type
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
  const dataToUpdate = updateSubdocumentFields('items', { isOrdered });

  List.findOneAndUpdate(
    {
      _id: listId,
      'items._id': itemId,
      $or: [{ ownerIds: userId }, { memberIds: userId }]
    },
    {
      $set: dataToUpdate
    },
    { new: true },
    (err, doc) => {
      if (err) {
        return resp.status(400).send({
          message:
            'An error occurred while updating the list data. Please try again.'
        });
      }

      if (!doc) {
        return resp.status(400).send({
          message:
            "List data not found or you don't have permission to perform this action."
        });
      }

      const itemIndex = doc.items.findIndex(item => item._id.equals(itemId));
      const item = doc.items[itemIndex];

      resp.status(200).json(responseWithItem(item, userId));
    }
  );
};

const voteForItem = (req, resp) => {
  const { itemId } = req.body;
  const { id: listId } = req.params;
  const {
    user: { _id: userId }
  } = req;

  List.findOne({
    _id: listId,
    memberIds: userId,
    'items._id': itemId
  })
    .exec()
    .then(list => {
      if (!list) {
        throw new BadRequestException('List data not found.');
      }

      const { items } = list;
      const item = items.id(itemId);

      item.voterIds.push(userId);

      return list.save();
    })
    .then(list => {
      const { items } = list;
      const updatedItem = items.id(itemId);

      resp.status(200).json(responseWithItem(updatedItem, userId));
    })
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { status, message } = err;
        return resp.status(status).send({ message });
      }

      resp.status(400).send({ message: 'List data not found' });
    });
};

const clearVote = (req, resp) => {
  const { itemId } = req.body;
  const { id: listId } = req.params;
  const {
    user: { _id: userId }
  } = req;

  List.findOne({
    _id: listId,
    memberIds: userId,
    'items._id': itemId
  })
    .exec()
    .then(list => {
      if (!list) {
        throw new BadRequestException('List data not found.');
      }

      const { items } = list;
      const item = items.id(itemId);
      const voterIdIndex = item.voterIds.indexOf(userId);

      item.voterIds.splice(voterIdIndex, 1);

      return list.save();
    })
    .then(list => {
      const { items } = list;
      const updatedItem = items.id(itemId);

      resp.status(200).json(responseWithItem(updatedItem, userId));
    })
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { status, message } = err;

        return resp.status(status).send({ message });
      }

      resp.status(400).send({ message: 'List data not found' });
    });
};

const updateListById = (req, resp) => {
  const { description, isArchived, name } = req.body;
  const {
    user: { _id: userId }
  } = req;
  const { id: listId } = req.params;
  const dataToUpdate = filter(x => x !== undefined)({
    description,
    isArchived,
    name
  });

  List.findOneAndUpdate(
    {
      _id: listId,
      ownerIds: userId
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
            .send({ message: `List "${doc.name}" successfully updated.` })
        : resp.status(404).send({ message: 'List data not found.' });
    }
  );
};

const addToFavourites = (req, resp) => {
  const { id: listId } = req.params;
  const {
    user: { _id: userId }
  } = req;

  List.findOneAndUpdate(
    {
      _id: listId,
      viewersIds: userId
    },
    {
      $push: { favIds: userId }
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
  const {
    user: { _id: userId }
  } = req;

  List.findOneAndUpdate(
    {
      _id: listId,
      viewersIds: userId
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
    { $pull: { ownerIds: userId, memberIds: userId, viewersIds: userId } },
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
    { _id: listId, ownerIds: ownerId, viewersIds: userId },
    { $pull: { viewersIds: userId, memberIds: userId, ownerIds: userId } },
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

const addOwnerRole = (req, resp) => {
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
      const { memberIds, ownerIds } = doc;
      const userIsNotAnOwner = !checkIfArrayContainsUserId(ownerIds, userId);

      if (userIsNotAnOwner) {
        doc.ownerIds.push(userId);
      }

      const userIsNotAMember = !checkIfArrayContainsUserId(memberIds, userId);

      if (userIsNotAMember) {
        doc.memberIds.push(userId);
      }

      return doc.save();
    })
    .then(() =>
      resp.status(200).send({
        message: "User has been successfully set as a list's owner."
      })
    )
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { status, message } = err;
        return resp.status(status).send({ message });
      }

      resp.status(400).send({ message: 'List data not found' });
    });
};

const removeOwnerRole = (req, resp) => {
  const { id: listId } = req.params;
  const { userId } = req.body;

  const {
    user: { _id: ownerId }
  } = req;

  List.findOne({ _id: listId, ownerIds: ownerId })
    .exec()
    .then(doc => {
      if (!doc) {
        throw new BadRequestException("Can't remove owner role.");
      }

      const { ownerIds } = doc;
      const userIsOwner = checkIfArrayContainsUserId(ownerIds, userId);

      if (userIsOwner) {
        ownerIds.splice(doc.ownerIds.indexOf(userId), 1);
      }

      return doc.save();
    })
    .then(() =>
      resp.status(200).send({
        message: 'User has no owner role.'
      })
    )
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { status, message } = err;
        return resp.status(status).send({ message });
      }

      resp.status(400).send({ message: 'List data not found' });
    });
};

const addMemberRole = (req, resp) => {
  const { id: listId } = req.params;
  const { userId } = req.body;
  const {
    user: { _id: ownerId }
  } = req;

  List.findOne({ _id: listId, ownerIds: ownerId })
    .exec()
    .then(doc => {
      if (!doc) {
        throw new BadRequestException("Can't set user as a list's member.");
      }

      const { ownerIds, memberIds } = doc;
      const userIsNotAMember = !checkIfArrayContainsUserId(memberIds, userId);

      if (userIsNotAMember) {
        memberIds.push(userId);
      }

      const userIsOwner = checkIfArrayContainsUserId(ownerIds, userId);

      if (userIsOwner) {
        ownerIds.splice(ownerIds.indexOf(userId), 1);
      }

      return doc.save();
    })
    .then(() =>
      resp.status(200).send({
        message: "User has been successfully set as a list's member."
      })
    )
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { status, message } = err;
        return resp.status(status).send({ message });
      }

      resp.status(400).send({ message: 'List data not found' });
    });
};

const removeMemberRole = (req, resp) => {
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
        throw new BadRequestException("Can't remove member role");
      }

      const { memberIds, ownerIds } = doc;
      const userIsMember = checkIfArrayContainsUserId(memberIds, userId);

      if (userIsMember) {
        memberIds.splice(memberIds.indexOf(userId), 1);
      }

      const userIsOwner = checkIfArrayContainsUserId(ownerIds, userId);

      if (userIsOwner) {
        ownerIds.splice(ownerIds.indexOf(userId), 1);
      }

      return doc.save();
    })
    .then(() => resp.status(200).send({ message: 'User has no member role' }))
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { status, message } = err;
        return resp.status(status).send({ message });
      }

      resp.status(400).send({ message: 'List data not found' });
    });
};

const addViewer = (req, resp) => {
  const {
    user: { _id: currentUserId }
  } = req;
  const { id: listId } = req.params;
  const { email } = req.body;
  let list;
  let user;
  let cohortMembers = [];

  List.findOne({
    _id: listId,
    memberIds: currentUserId
  })
    .populate('cohortId', 'ownerIds memberIds')
    .exec()
    .then(doc => {
      list = doc;

      return User.findOne({ email }).exec();
    })
    .then(userData => {
      if (!userData) {
        throw new BadRequestException(`There is no user of email: ${email}`);
      }

      const { _id: newMemberId } = userData;
      const { cohortId: cohort, viewersIds } = list;
      const userNotExists = !checkIfArrayContainsUserId(
        viewersIds,
        newMemberId
      );

      user = userData;

      if (userNotExists) {
        list.viewersIds.push(newMemberId);
      }

      if (cohort) {
        const { memberIds } = cohort;
        cohortMembers = memberIds;
      }

      return list.save();
    })
    .then(() => {
      const userToSend = responseWithListMember(user, cohortMembers);

      resp.status(200).json(userToSend);
    })
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { status, message } = err;

        return resp.status(status).send({ message });
      }

      resp.status(400).send({
        message: 'An error occurred while adding new viewer. Please try again.'
      });
    });
};

const updateItemDetails = (req, resp) => {
  const { description, link, itemId } = req.body;
  const {
    user: { _id: userId }
  } = req;
  const { id: listId } = req.params;

  List.findOne({
    _id: listId,
    'items._id': itemId,
    memberIds: userId
  })
    .exec()
    .then(list => {
      if (!list) {
        throw new BadRequestException('List data not found.');
      }

      const { items } = list;
      const itemToUpdate = items.id(itemId);

      if (description) {
        itemToUpdate.description = description;
      }

      if (link) {
        itemToUpdate.link = link;
      }

      return list.save();
    })
    .then(() =>
      resp.status(200).send({ message: 'Item details successfully updated' })
    )
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { status, message } = err;

        return resp.status(status).send({ message });
      }

      resp.status(400).send({ message: 'List data not found' });
    });
};

const cloneItem = (req, resp) => {
  const { itemId } = req.body;
  const { id: listId } = req.params;
  const { _id: userId, displayName: userName } = req.user;
  let newItemId;

  List.findOne({
    _id: listId,
    'items._id': itemId,
    memberIds: userId
  })
    .exec()
    .then(list => {
      if (!list) {
        throw new BadRequestException('List data not found.');
      }

      const { description, link, name } = list.items.id(itemId);
      const item = new Item({
        authorId: userId,
        authorName: userName,
        description,
        link,
        name
      });

      newItemId = item._id;
      list.items.push(item);

      return list.save();
    })
    .then(list =>
      resp.status(200).send({
        message: 'Item successfully cloned.',
        item: responseWithItem(list.items.id(newItemId))
      })
    )
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { status, message } = err;

        return resp.status(status).send({ message });
      }

      resp.status(400).send({ message: 'List data not found' });
    });
};

const changeType = (req, resp) => {
  const { type } = req.body;
  const { id: listId } = req.params;
  const { _id: currentUserId } = req.user;
  let cohortMembers;

  List.findOneAndUpdate(
    { _id: listId, ownerIds: currentUserId },
    { type },
    { new: true }
  )
    .populate('cohortId', 'memberIds')
    .exec()
    .then(list => {
      if (!list) {
        throw new BadRequestException('List data not found.');
      }
      const {
        cohortId: { memberIds: cohortMembersCollection },
        memberIds,
        type,
        viewersIds
      } = list;

      cohortMembers = cohortMembersCollection;

      const updatedViewersIds =
        type === ListType.LIMITED
          ? viewersIds.filter(id => checkIfArrayContainsUserId(memberIds, id))
          : [
              ...viewersIds,
              ...cohortMembers.filter(
                id => !checkIfArrayContainsUserId(viewersIds, id)
              )
            ];

      return List.findOneAndUpdate(
        { _id: listId, ownerIds: currentUserId },
        { viewersIds: updatedViewersIds },
        { new: true }
      )
        .populate('viewersIds', 'avatarUrl displayName _id')
        .exec();
    })
    .then(list => {
      const {
        memberIds,
        name,
        ownerIds,
        type,
        viewersIds: viewersCollection
      } = list;
      const members = responseWithListMembers(
        viewersCollection,
        memberIds,
        ownerIds,
        cohortMembers
      );

      resp.status(200).send({
        message: `"${name}" list's type change to ${type}.`,
        data: { members, type }
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

module.exports = {
  addItemToList,
  addMemberRole,
  addOwnerRole,
  addToFavourites,
  addViewer,
  changeType,
  clearVote,
  cloneItem,
  createList,
  deleteListById,
  getArchivedListsMetaData,
  getListData,
  getListsMetaData,
  removeFromFavourites,
  removeMember,
  removeMemberRole,
  removeOwner,
  removeOwnerRole,
  updateItemDetails,
  updateListById,
  updateListItem,
  voteForItem
};
