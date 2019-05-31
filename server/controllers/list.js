const sanitize = require('mongo-sanitize');

const List = require('../models/list.model');
const Item = require('../models/item.model');
const {
  checkIfArrayContainsUserId,
  filter,
  isValidMongoId,
  responseWithItems,
  responseWithItem,
  responseWithList,
  responseWithListsMetaData
} = require('../common/utils');
const Cohort = require('../models/cohort.model');
const NotFoundException = require('../common/exceptions/NotFoundException');
const BadRequestException = require('../common/exceptions/BadRequestException');
const User = require('../models/user.model');
const {
  responseWithListMember,
  responseWithListMembers
} = require('../common/utils/index');
const { DEMO_MODE_ID, ListType } = require('../common/variables');
const Comment = require('../models/comment.model');

const createList = (req, resp) => {
  const { cohortId, description, name, type } = req.body;
  const {
    user: { _id: userId }
  } = req;
  const isSharedList = type === ListType.SHARED;

  const list = new List({
    cohortId,
    description,
    memberIds: userId,
    name,
    ownerIds: userId,
    type,
    viewersIds: userId
  });

  if (cohortId && isSharedList) {
    Cohort.findOne({ _id: sanitize(cohortId) })
      .exec()
      .then(cohort => {
        const { memberIds } = cohort;

        if (checkIfArrayContainsUserId(memberIds, userId)) {
          list.viewersIds = memberIds;

          return list.save();
        }

        throw new BadRequestException(
          'You need to be cohort member to create new sacks'
        );
      })
      .then(listData =>
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
        resp.status(400).send({ message: 'Sack not saved. Please try again.' });
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
        resp.status(400).send({ message: 'Sack not saved. Please try again.' });
      });
  }
};

const deleteListById = (req, resp) => {
  const {
    user: { _id: userId },
    params: { id: listId }
  } = req;
  let listName;

  List.findOneAndDelete({ _id: sanitize(listId), ownerIds: userId })
    .exec()
    .then(doc => {
      if (!doc) {
        throw new BadRequestException('Sack data not found.');
      }

      listName = doc.name;

      return Comment.deleteMany({ listId }).exec();
    })
    .then(() =>
      resp.status(200).send({
        message: `Sack "${listName}" successfully deleted.`
      })
    )
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { status, message } = err;
        return resp.status(status).send({ message });
      }
      resp.status(400).send({
        message: 'An error occurred while deleting the sack. Please try again.'
      });
    });
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
    query.cohortId = sanitize(cohortId);
  }

  List.find(query, '_id name description items favIds cohortId type', {
    sort: { created_at: -1 }
  })
    .lean()
    .exec()
    .then(docs => {
      if (!docs) {
        return resp.status(400).send({ message: 'No sacks data found.' });
      }

      return resp.status(200).json(responseWithListsMetaData(docs, userId));
    })
    .catch(() =>
      resp.status(400).send({
        message:
          'An error occurred while fetching the sacks data. Please try again.'
      })
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
    query.cohortId = sanitize(cohortId);
  }

  List.find(
    query,
    `_id name description type items favIds isArchived ${
      cohortId ? 'cohortId' : ''
    }`,
    { sort: { created_at: -1 } }
  )
    .lean()
    .exec()
    .then(docs => {
      if (!docs) {
        return resp
          .status(400)
          .send({ message: 'No archived sacks data found.' });
      }

      return resp.status(200).json(responseWithListsMetaData(docs, userId));
    })
    .catch(() =>
      resp.status(400).send({
        message:
          'An error occurred while fetching the archived sacks data. Please try again.'
      })
    );
};

const addItemToList = (req, resp) => {
  const {
    item: { name, authorId },
    listId
  } = req.body;
  const {
    user: { _id: userId }
  } = req;

  const item = new Item({
    authorId,
    name
  });

  List.findOneAndUpdate(
    {
      _id: sanitize(listId),
      memberIds: userId
    },
    { $push: { items: item } },
    { new: true }
  )
    .lean()
    .populate('items.authorId', 'displayName')
    .exec()
    .then(doc => {
      if (!doc) {
        return resp.status(400).send({ message: 'Sack not found.' });
      }

      const newItem = doc.items.slice(-1)[0];

      return resp.status(200).send(responseWithItem(newItem, userId));
    })
    .catch(() =>
      resp.status(400).send({
        message: 'An error occurred while adding a new item. Please try again.'
      })
    );
};

const getListData = (req, resp) => {
  const {
    params: { id: listId },
    user: { _id: userId }
  } = req;
  const sanitizedListId = sanitize(listId);

  if (!isValidMongoId(listId)) {
    return resp
      .status(404)
      .send({ message: `Data of sack id: ${listId} not found.` });
  }

  let list;

  List.findOne({
    _id: sanitizedListId,
    viewersIds: userId
  })
    .lean()
    .populate('viewersIds', 'avatarUrl displayName _id')
    .populate('items.authorId', 'displayName')
    .exec()
    .then(doc => {
      if (!doc) {
        throw new NotFoundException(`Data of sack id: ${listId} not found.`);
      }
      list = doc;
      const { cohortId } = list;

      if (cohortId) {
        return Cohort.findOne({ _id: cohortId }).exec();
      }
    })
    .then(cohort => cohort || [])
    .then(cohort => {
      const { memberIds: cohortMemberIds, name: cohortName } = cohort;
      const cohortMembers = cohortMemberIds || [];

      const {
        _id,
        cohortId,
        description,
        isArchived,
        items: listItems,
        memberIds,
        name,
        ownerIds,
        type,
        viewersIds: viewersCollection
      } = list;

      if (isArchived) {
        return resp
          .status(200)
          .json({ cohortId, cohortName, _id, isArchived, name, type });
      }

      const activeItems = listItems.filter(item => !item.isArchived);
      const members = responseWithListMembers(
        viewersCollection,
        memberIds,
        ownerIds,
        cohortMembers
      );

      const isGuest = !checkIfArrayContainsUserId(cohortMembers, userId);
      const isMember = checkIfArrayContainsUserId(memberIds, userId);
      const isOwner = checkIfArrayContainsUserId(ownerIds, userId);
      const items = responseWithItems(userId, activeItems);

      return resp.status(200).json({
        _id,
        cohortId,
        cohortName,
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
          'An error occurred while fetching the sack data. Please try again.'
      });
    });
};

const voteForItem = (req, resp) => {
  const { itemId } = req.body;
  const { id: listId } = req.params;
  const {
    user: { _id: userId }
  } = req;

  List.findOne({
    _id: sanitize(listId),
    memberIds: userId,
    'items._id': sanitize(itemId)
  })
    .exec()
    .then(list => {
      if (!list) {
        throw new BadRequestException('Sack data not found.');
      }

      const { items } = list;
      const item = items.id(itemId);

      if (checkIfArrayContainsUserId(item.voterIds, userId)) {
        throw new BadRequestException('You have already voted.');
      }

      item.voterIds.push(userId);

      return list.save();
    })
    .then(() => resp.status(200).json({ message: 'Vote saved.' }))
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { status, message } = err;
        return resp.status(status).send({ message });
      }

      resp.status(400).send({ message: 'Sack data not found' });
    });
};

const clearVote = (req, resp) => {
  const { itemId } = req.body;
  const { id: listId } = req.params;
  const {
    user: { _id: userId }
  } = req;

  List.findOne({
    _id: sanitize(listId),
    memberIds: userId,
    'items._id': sanitize(itemId)
  })
    .exec()
    .then(list => {
      if (!list) {
        throw new BadRequestException('Sack data not found.');
      }

      const { items } = list;
      const item = items.id(itemId);

      if (!checkIfArrayContainsUserId(item.voterIds, userId)) {
        throw new BadRequestException(
          'You have not voted yet, so you can not removed your vote.'
        );
      }

      const voterIdIndex = item.voterIds.indexOf(userId);

      item.voterIds.splice(voterIdIndex, 1);

      return list.save();
    })
    .then(() => resp.status(200).json({ message: 'Vote removed.' }))
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { status, message } = err;

        return resp.status(status).send({ message });
      }

      resp.status(400).send({ message: 'Sack data not found' });
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
      _id: sanitize(listId),
      ownerIds: userId
    },
    dataToUpdate
  )
    .exec()
    .then(doc => {
      if (!doc) {
        return resp.status(400).send({ message: 'Sack data not found.' });
      }

      return resp
        .status(200)
        .send({ message: `Sack "${doc.name}" successfully updated.` });
    })
    .catch(() =>
      resp.status(400).send({
        message:
          'An error occurred while updating the sack data. Please try again.'
      })
    );
};

const addToFavourites = (req, resp) => {
  const { id: listId } = req.params;
  const {
    user: { _id: userId }
  } = req;

  List.findOneAndUpdate(
    {
      _id: sanitize(listId),
      viewersIds: userId
    },
    {
      $push: { favIds: userId }
    }
  )
    .exec()
    .then(doc => {
      if (!doc) {
        return resp.status(400).send({ message: 'Sack data not found.' });
      }

      return resp.status(200).send({
        message: `Sack "${doc.name}" successfully marked as favourite.`
      });
    })
    .catch(() =>
      resp.status(400).send({
        message: "Can't mark sack as favourite. Please try again."
      })
    );
};

const removeFromFavourites = (req, resp) => {
  const { id: listId } = req.params;
  const {
    user: { _id: userId }
  } = req;

  List.findOneAndUpdate(
    {
      _id: sanitize(listId),
      viewersIds: userId
    },
    {
      $pull: { favIds: userId }
    }
  )
    .exec()
    .then(doc => {
      if (!doc) {
        return resp.status(400).send({ message: 'Sack data not found.' });
      }

      return resp.status(200).send({
        message: `Sack "${doc.name}" successfully removed from favourites.`
      });
    })
    .catch(() =>
      resp.status(400).send({
        message: "Can't remove sack from favourites. Please try again."
      })
    );
};

const removeOwner = (req, resp) => {
  const { id: listId } = req.params;
  const { userId } = req.body;
  const {
    user: { _id: currentUserId }
  } = req;

  List.findOneAndUpdate(
    {
      _id: sanitize(listId),
      ownerIds: { $all: [currentUserId, sanitize(userId)] }
    },
    { $pull: { ownerIds: userId, memberIds: userId, viewersIds: userId } }
  )
    .exec()
    .then(doc => {
      if (!doc) {
        return resp.status(400).send({ message: 'Sack data not found.' });
      }

      return resp.status(200).send({
        message: 'Owner successfully removed from sack.'
      });
    })
    .catch(() =>
      resp.status(400).send({
        message: "Can't remove owner from sack."
      })
    );
};

const removeMember = (req, resp) => {
  const { id: listId } = req.params;
  const { userId } = req.body;
  const {
    user: { _id: currentUserId }
  } = req;
  const sanitizedUserId = sanitize(userId);

  List.findOneAndUpdate(
    {
      _id: sanitize(listId),
      ownerIds: currentUserId,
      viewersIds: sanitizedUserId
    },
    {
      $pull: {
        viewersIds: sanitizedUserId,
        memberIds: sanitizedUserId,
        ownerIds: sanitizedUserId
      }
    }
  )
    .exec()
    .then(doc => {
      if (!doc) {
        return resp.status(400).send({ message: 'Sack data not found.' });
      }

      return resp.status(200).send({
        message: 'Member successfully removed from sack.'
      });
    })
    .catch(() =>
      resp.status(400).send({
        message: "Can't remove member from sack."
      })
    );
};

const addOwnerRole = (req, resp) => {
  const { id: listId } = req.params;
  const { userId } = req.body;
  const {
    user: { _id: currentUserId }
  } = req;

  List.findOne({ _id: sanitize(listId), ownerIds: currentUserId })
    .populate('cohortId', 'memberIds ownerIds')
    .exec()
    .then(doc => {
      if (!doc) {
        throw new BadRequestException("Can't set user as a sack's owner.");
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
        message: "User has been successfully set as a sack's owner."
      })
    )
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { status, message } = err;
        return resp.status(status).send({ message });
      }

      resp.status(400).send({ message: 'Sack data not found' });
    });
};

const removeOwnerRole = (req, resp) => {
  const { id: listId } = req.params;
  const { userId } = req.body;

  const {
    user: { _id: ownerId }
  } = req;

  List.findOne({ _id: sanitize(listId), ownerIds: ownerId })
    .exec()
    .then(doc => {
      if (!doc) {
        throw new BadRequestException("Can't remove owner role.");
      }

      const { name, ownerIds } = doc;

      if (ownerIds.length < 2) {
        throw new BadRequestException(
          `You can not remove the owner role from yourself because you are the only owner in the "${name}" sack.`
        );
      }
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

      resp.status(400).send({ message: 'Sack data not found' });
    });
};

const addMemberRole = (req, resp) => {
  const { id: listId } = req.params;
  const { userId } = req.body;
  const {
    user: { _id: currentUserId }
  } = req;

  List.findOne({ _id: sanitize(listId), ownerIds: { $in: [currentUserId] } })
    .exec()
    .then(doc => {
      if (!doc) {
        throw new BadRequestException("Can't set user as a sack's member.");
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
        message: "User has been successfully set as a sack's member."
      })
    )
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { status, message } = err;
        return resp.status(status).send({ message });
      }

      resp.status(400).send({ message: 'Sack data not found' });
    });
};

const removeMemberRole = (req, resp) => {
  const { id: listId } = req.params;
  const { userId } = req.body;
  const {
    user: { _id: currentUserId }
  } = req;

  List.findOne({ _id: sanitize(listId), ownerIds: { $in: [currentUserId] } })
    .populate('cohortId', 'memberIds ownerIds')
    .exec()
    .then(doc => {
      if (!doc) {
        throw new BadRequestException("Can't remove member role");
      }

      const { memberIds, name, ownerIds } = doc;

      const userIsOwner = checkIfArrayContainsUserId(ownerIds, userId);

      if (userIsOwner && ownerIds.length < 2) {
        throw new BadRequestException(
          `You can not remove the member and owner role from yourself because you are the only owner in the "${name}" sack.`
        );
      }

      const userIsMember = checkIfArrayContainsUserId(memberIds, userId);

      if (userIsMember) {
        memberIds.splice(memberIds.indexOf(userId), 1);
      }

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

      resp.status(400).send({ message: 'Sack data not found' });
    });
};

const addViewer = (req, resp) => {
  const {
    user: { _id: currentUserId, idFromProvider }
  } = req;
  const { id: listId } = req.params;
  const { email } = req.body;
  let list;
  let user;
  let cohortMembers = [];

  if (idFromProvider === DEMO_MODE_ID) {
    return resp
      .status(401)
      .send({ message: 'Adding members is disabled in demo mode.' });
  }

  List.findOne({
    _id: sanitize(listId),
    memberIds: currentUserId
  })
    .populate('cohortId', 'ownerIds memberIds')
    .exec()
    .then(doc => {
      list = doc;

      return User.findOne({ email: sanitize(email) }).exec();
    })
    .then(userData => {
      if (!userData) {
        return;
      }

      if (userData.idFromProvider === DEMO_MODE_ID) {
        throw new BadRequestException(`There is no user of email: ${email}`);
      }

      const { _id: newMemberId } = userData;
      const { cohortId: cohort, viewersIds } = list;
      const userExists = checkIfArrayContainsUserId(viewersIds, newMemberId);

      if (userExists) {
        throw new BadRequestException('User is already a member.');
      }

      user = userData;
      list.viewersIds.push(newMemberId);

      if (cohort) {
        const { memberIds } = cohort;
        cohortMembers = memberIds;
      }

      return list.save();
    })
    .then(() => {
      if (user) {
        const userToSend = responseWithListMember(user, cohortMembers);

        return resp.status(200).json(userToSend);
      }

      resp.status(204).send();
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

const updateListItem = (req, resp) => {
  const {
    authorId,
    description,
    isArchived,
    isOrdered,
    itemId,
    name
  } = req.body;

  const {
    user: { _id: userId }
  } = req;
  const { id: listId } = req.params;

  const sanitizeItemId = sanitize(itemId);

  List.findOne({
    _id: sanitize(listId),
    'items._id': sanitizeItemId,
    memberIds: userId
  })
    .exec()
    .then(list => {
      if (!list) {
        throw new BadRequestException('Sack data not found.');
      }

      const { items } = list;
      const itemToUpdate = items.id(sanitizeItemId);

      if (description !== undefined) {
        itemToUpdate.description = description;
      }

      if (isOrdered !== undefined) {
        itemToUpdate.isOrdered = isOrdered;
      }

      if (authorId) {
        itemToUpdate.authorId = authorId;
      }

      if (name) {
        itemToUpdate.name = name;
      }

      if (isArchived !== undefined) {
        itemToUpdate.isArchived = isArchived;
      }

      return list.save();
    })
    .then(() =>
      resp.status(200).json({ message: 'Item successfully updated.' })
    )
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { status, message } = err;

        return resp.status(status).send({ message });
      }

      resp.status(400).send({
        message: 'An error occurred while updating the item. Please try again.'
      });
    });
};

const cloneItem = (req, resp) => {
  const { itemId } = req.body;
  const { id: listId } = req.params;
  const { _id: userId } = req.user;

  List.findOne({
    _id: sanitize(listId),
    'items._id': sanitize(itemId),
    memberIds: userId
  })
    .exec()
    .then(list => {
      if (!list) {
        throw new BadRequestException('Sack data not found.');
      }

      const { description, link, name } = list.items.id(itemId);

      const item = new Item({
        authorId: userId,
        description,
        link,
        name
      });

      return List.findByIdAndUpdate(
        {
          _id: sanitize(listId),
          memberIds: userId
        },
        { $push: { items: item } },
        { new: true }
      )
        .lean()
        .populate('items.authorId', 'displayName')
        .exec();
    })
    .then(list => {
      if (!list) {
        return resp.status(400).send({
          message: 'An error occurred while cloning the item. Please try again.'
        });
      }

      const newItem = list.items.slice(-1)[0];

      resp.status(200).send({
        message: 'Item successfully cloned.',
        item: responseWithItem(newItem, userId)
      });
    })
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { status, message } = err;

        return resp.status(status).send({ message });
      }

      resp.status(400).send({
        message: 'An error occurred while cloning the item. Please try again.'
      });
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
        throw new BadRequestException('Sack data not found.');
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
        .lean()
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
        message: `"${name}" sack's type change to ${type}.`,
        data: { members, type }
      });
    })
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { status, message } = err;

        return resp.status(status).send({ message });
      }

      resp.status(400).send({ message: 'Sack data not found' });
    });
};

const getArchivedItems = (req, resp) => {
  const { id: listId } = req.params;
  const { _id: userId } = req.user;

  List.findOne(
    {
      _id: sanitize(listId),
      memberIds: userId
    },
    'items name'
  )
    .lean()
    .populate('items.authorId', 'displayName')
    .exec()
    .then(list => {
      if (!list) {
        return resp.status(400).send();
      }

      const { items } = list;
      const archivedItems = items.filter(item => item.isArchived);

      resp.status(200).send(responseWithItems(userId, archivedItems));
    })
    .catch(() => resp.status(400).send());
};

const deleteItem = (req, resp) => {
  const { id: listId, itemId } = req.params;
  const { _id: userId } = req.user;
  const sanitizeItemId = sanitize(itemId);

  List.findOneAndUpdate(
    {
      _id: sanitize(listId),
      memberIds: userId,
      'items._id': sanitizeItemId
    },
    { $pull: { items: { _id: sanitizeItemId } } }
  )
    .exec()
    .then(list => {
      if (!list) {
        return resp.status(400).send();
      }

      resp.status(200).send();
    })
    .catch(() => resp.status(400).send());
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
  deleteItem,
  deleteListById,
  getArchivedItems,
  getArchivedListsMetaData,
  getListData,
  getListsMetaData,
  removeFromFavourites,
  removeMember,
  removeMemberRole,
  removeOwner,
  removeOwnerRole,
  updateListById,
  updateListItem,
  voteForItem
};
