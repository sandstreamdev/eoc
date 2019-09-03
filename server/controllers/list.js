const sanitize = require('mongo-sanitize');
const _difference = require('lodash/difference');
const validator = require('validator');

const List = require('../models/list.model');
const Item = require('../models/item.model');
const {
  checkIfArrayContainsUserId,
  filter,
  fireAndForget,
  isDefined,
  isMember,
  isOwner,
  isValidMongoId,
  isViewer,
  responseWithItem,
  responseWithItems,
  responseWithList,
  responseWithListsMetaData,
  returnPayload
} = require('../common/utils');
const Cohort = require('../models/cohort.model');
const NotFoundException = require('../common/exceptions/NotFoundException');
const BadRequestException = require('../common/exceptions/BadRequestException');
const User = require('../models/user.model');
const {
  responseWithListMember,
  responseWithListMembers
} = require('../common/utils/index');
const { ActivityType, DEMO_MODE_ID, ListType } = require('../common/variables');
const Comment = require('../models/comment.model');
const { saveActivity } = require('./activity');
const cohortClients = require('../sockets/index').getCohortViewClients();
const dashboardClients = require('../sockets/index').getDashboardViewClients();
const listClients = require('../sockets/index').getListViewClients();
const socketInstance = require('../sockets/index').getSocketInstance();
const onlineClients = require('../sockets/index').getOnlineClients();
const { createListCohort } = require('../sockets/cohort');
const socketActions = require('../sockets/list');

const createList = (req, resp) => {
  const { cohortId, description, name, type } = req.body;
  const {
    user: { _id: userId }
  } = req;
  const isSharedList = type === ListType.SHARED;

  if (!validator.isLength(name, { min: 1, max: 32 })) {
    return resp.sendStatus(400);
  }

  const list = new List({
    cohortId,
    description,
    memberIds: userId,
    name,
    ownerIds: userId,
    type,
    viewersIds: userId
  });
  let listData;

  if (cohortId && isSharedList) {
    Cohort.findOne({ _id: sanitize(cohortId) })
      .exec()
      .then(cohort => {
        const { memberIds } = cohort;

        if (isMember(cohort, userId)) {
          list.viewersIds = memberIds;

          return list.save();
        }

        throw new BadRequestException();
      })
      .then(() => {
        listData = responseWithList(list, userId);

        return createListCohort(socketInstance, dashboardClients)({
          ...listData,
          cohortId
        });
      })
      .then(() =>
        resp
          .status(201)
          .location(`/lists/${list._id}`)
          .send(listData)
      )
      .catch(err => {
        if (err instanceof BadRequestException) {
          resp.sendStatus(400);
        }
      });
  } else {
    list
      .save()
      .then(() => {
        fireAndForget(
          saveActivity(
            ActivityType.LIST_ADD,
            userId,
            null,
            list._id,
            list.cohortId
          )
        );

        resp
          .status(201)
          .location(`/lists/${list._id}`)
          .send(responseWithList(list, userId));
      })
      .catch(() => resp.sendStatus(400));
  }
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

  List.find(query, '_id name created_at description items favIds type', {
    sort: { created_at: -1 }
  })
    .populate('cohortId', 'isArchived')
    .lean()
    .exec()
    .then(docs => {
      if (!docs) {
        return resp.sendStatus(400);
      }

      return resp.send(responseWithListsMetaData(docs, userId));
    })
    .catch(() => resp.sendStatus(400));
};

const getArchivedListsMetaData = (req, resp) => {
  const { cohortId } = req.params;
  const {
    user: { _id: userId }
  } = req;

  const query = {
    $or: [{ ownerIds: userId }, { memberIds: userId }],
    isArchived: true,
    isDeleted: false
  };

  if (cohortId) {
    query.cohortId = sanitize(cohortId);
  }

  List.find(
    query,
    '_id name created_at description type items favIds isArchived',
    {
      sort: { created_at: -1 }
    }
  )
    .populate('cohortId', 'isArchived')
    .lean()
    .exec()
    .then(docs => {
      if (!docs) {
        return resp.sendStatus(400);
      }

      return resp.send(responseWithListsMetaData(docs, userId));
    })
    .catch(() => resp.sendStatus(400));
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
        return resp.sendStatus(400);
      }

      const { cohortId, items } = doc;
      const newItem = items.slice(-1)[0];
      const itemToSend = responseWithItem(newItem, userId);
      const data = { listId, item: itemToSend };
      const payload = { itemToSend, cohortId };

      return returnPayload(
        socketActions.addItemToList(
          socketInstance,
          cohortClients,
          dashboardClients
        )(data)
      )(payload);
    })
    .then(payload => {
      const { itemToSend, cohortId } = payload;

      fireAndForget(
        saveActivity(
          ActivityType.ITEM_ADD,
          userId,
          itemToSend._id,
          listId,
          cohortId
        )
      );

      resp.send(itemToSend);
    })
    .catch(() => resp.sendStatus(400));
};

const getListData = (req, resp) => {
  const {
    params: { id: listId },
    user: { _id: userId }
  } = req;
  const sanitizedListId = sanitize(listId);

  if (!isValidMongoId(listId)) {
    return resp.sendStatus(404);
  }

  let list;

  List.findOne({
    _id: sanitizedListId,
    isDeleted: false,
    viewersIds: userId
  })
    .lean()
    .populate('viewersIds', 'avatarUrl displayName _id')
    .populate('items.authorId', 'displayName')
    .populate('items.editedBy', 'displayName')
    .exec()
    .then(doc => {
      if (!doc) {
        throw new NotFoundException();
      }
      list = doc;
      const { cohortId } = list;

      if (cohortId) {
        return Cohort.findOne({ _id: cohortId }).exec();
      }
    })
    .then(cohort => cohort || [])
    .then(cohort => {
      const {
        isArchived: isCohortArchived,
        memberIds: cohortMemberIds,
        name: cohortName
      } = cohort;
      const cohortMembers = cohortMemberIds || [];

      if (isCohortArchived) {
        throw new NotFoundException();
      }

      const {
        _id,
        cohortId,
        description,
        isArchived,
        items: listItems,
        locks,
        memberIds,
        name,
        ownerIds,
        type,
        viewersIds: viewersCollection
      } = list;

      const isListMember = isMember(list, userId);
      const isListOwner = isOwner(list, userId);

      if (isArchived) {
        if (!isListMember) {
          return resp.sendStatus(404);
        }

        return resp.send({
          cohortId,
          cohortName,
          _id,
          isArchived,
          isMember: isListMember,
          isOwner: isListOwner,
          name,
          type
        });
      }

      const activeItems = listItems.filter(item => !item.isArchived);
      const members = responseWithListMembers(
        viewersCollection,
        memberIds,
        ownerIds,
        cohortMembers
      );
      const items = responseWithItems(userId, activeItems);

      return resp.send({
        _id,
        cohortId,
        cohortName,
        description,
        isArchived,
        isGuest: !cohortId || (cohortId && !isMember(cohort, userId)),
        isMember: isListMember,
        isOwner: isListOwner,
        items,
        locks,
        members,
        name,
        type
      });
    })
    .catch(err =>
      resp.sendStatus(err instanceof NotFoundException ? 404 : 400)
    );
};

const voteForItem = (req, resp) => {
  const { itemId } = req.body;
  const { id: listId } = req.params;
  const {
    user: { _id: userId }
  } = req;
  const sanitizedItemId = sanitize(itemId);
  const sanitizedListId = sanitize(listId);

  List.findOne({
    _id: sanitizedListId,
    memberIds: userId,
    'items._id': sanitizedItemId
  })
    .exec()
    .then(doc => {
      if (!doc) {
        return resp.sendStatus(400);
      }

      const { items, viewersIds } = doc;
      const item = items.id(sanitizedItemId);
      const data = { listId, userId, itemId };

      item.voterIds.push(userId);

      return returnPayload(
        socketActions.setVote(socketInstance, listClients, viewersIds)(data)
      )(doc);
    })
    .then(payload => payload.save())
    .then(doc => {
      if (!doc) {
        return resp.sendStatus(400);
      }

      fireAndForget(
        saveActivity(
          ActivityType.ITEM_ADD_VOTE,
          userId,
          sanitizedItemId,
          sanitizedListId,
          doc.cohortId
        )
      );

      resp.send();
    })
    .catch(() => resp.sendStatus(400));
};

const clearVote = (req, resp) => {
  const { itemId } = req.body;
  const { id: listId } = req.params;
  const {
    user: { _id: userId }
  } = req;
  const sanitizedItemId = sanitize(itemId);
  const sanitizedListId = sanitize(listId);

  List.findOne({
    _id: sanitizedListId,
    memberIds: userId,
    'items._id': sanitizedItemId
  })
    .exec()
    .then(doc => {
      if (!doc) {
        return resp.sendStatus(400);
      }

      const { items, viewersIds } = doc;
      const item = items.id(sanitizedItemId);
      const voterIdIndex = item.voterIds.indexOf(userId);
      const data = { listId, userId, itemId };

      item.voterIds.splice(voterIdIndex, 1);

      return returnPayload(
        socketActions.clearVote(socketInstance, listClients, viewersIds)(data)
      )(doc);
    })
    .then(payload => payload.save())
    .then(doc => {
      if (!doc) {
        return resp.sendStatus(400);
      }

      fireAndForget(
        saveActivity(
          ActivityType.ITEM_CLEAR_VOTE,
          userId,
          sanitizedItemId,
          sanitizedListId,
          doc.cohortId
        )
      );

      resp.send();
    })
    .catch(() => resp.sendStatus(400));
};

const updateListById = (req, resp) => {
  const { description, isArchived, isDeleted, name } = req.body;
  const {
    user: { _id: userId }
  } = req;
  const { id: listId } = req.params;
  const sanitizedListId = sanitize(listId);
  const dataToUpdate = filter(x => x !== undefined)({
    description,
    isArchived,
    isDeleted,
    name
  });
  let listActivity;
  let list;

  if (name !== undefined && !validator.isLength(name, { min: 1, max: 32 })) {
    return resp.sendStatus(400);
  }

  List.findOneAndUpdate(
    {
      _id: sanitizedListId,
      ownerIds: userId
    },
    dataToUpdate
  )
    .exec()
    .then(doc => {
      if (!doc) {
        return resp.sendStatus(400);
      }

      const { cohortId } = doc;
      list = doc;

      if (description !== undefined) {
        const { description: prevDescription } = doc;
        if (!description && prevDescription) {
          listActivity = ActivityType.LIST_REMOVE_DESCRIPTION;
        } else if (description && !prevDescription) {
          listActivity = ActivityType.LIST_ADD_DESCRIPTION;
        } else {
          listActivity = ActivityType.LIST_EDIT_DESCRIPTION;
        }

        const data = { listId, description };

        return socketActions.updateList(
          socketInstance,
          dashboardClients,
          cohortClients
        )(data);
      }

      if (name) {
        listActivity = ActivityType.LIST_EDIT_NAME;

        const data = { listId, name };

        return socketActions.updateList(
          socketInstance,
          dashboardClients,
          cohortClients
        )(data);
      }

      if (isArchived !== undefined) {
        const data = { listId, cohortId };

        if (isArchived) {
          listActivity = ActivityType.LIST_ARCHIVE;

          return socketActions.archiveList(
            socketInstance,
            dashboardClients,
            cohortClients,
            listClients
          )(data);
        }

        listActivity = ActivityType.LIST_RESTORE;

        return socketActions.restoreList(
          socketInstance,
          dashboardClients,
          cohortClients,
          listClients
        )(data);
      }

      if (isDeleted) {
        listActivity = ActivityType.LIST_DELETE;

        const data = { listId, cohortId };

        socketActions.deleteList(
          socketInstance,
          dashboardClients,
          cohortClients
        )(data);

        return Comment.updateMany(
          { listId: sanitizedListId },
          { isDeleted }
        ).exec();
      }
    })
    .then(() => {
      fireAndForget(
        saveActivity(
          listActivity,
          userId,
          null,
          sanitizedListId,
          list.cohortId,
          null,
          list.name
        )
      );

      resp.send();
    })
    .catch(() => resp.sendStatus(400));
};

const addToFavourites = (req, resp) => {
  const { id: listId } = req.params;
  const {
    user: { _id: userId }
  } = req;
  const sanitizedListId = sanitize(listId);

  List.findOneAndUpdate(
    {
      _id: sanitizedListId,
      viewersIds: userId
    },
    {
      $push: { favIds: userId }
    }
  )
    .exec()
    .then(doc => {
      if (!doc) {
        return resp.sendStatus(400);
      }

      fireAndForget(
        saveActivity(
          ActivityType.LIST_ADD_TO_FAV,
          userId,
          null,
          sanitizedListId,
          doc.cohortId
        )
      );

      resp.send();
    })
    .catch(() => resp.sendStatus(400));
};

const removeFromFavourites = (req, resp) => {
  const { id: listId } = req.params;
  const {
    user: { _id: userId }
  } = req;
  const sanitizedListId = sanitize(listId);

  List.findOneAndUpdate(
    {
      _id: sanitizedListId,
      viewersIds: userId
    },
    {
      $pull: { favIds: userId }
    }
  )
    .exec()
    .then(doc => {
      if (!doc) {
        return resp.sendStatus(400);
      }

      fireAndForget(
        saveActivity(
          ActivityType.LIST_REMOVE_FROM_FAV,
          userId,
          null,
          sanitizedListId,
          doc.cohortId
        )
      );

      resp.send();
    })
    .catch(() => resp.sendStatus(400));
};

const removeOwner = (req, resp) => {
  const { id: listId } = req.params;
  const { userId } = req.body;
  const {
    user: { _id: currentUserId }
  } = req;
  const sanitizedListId = sanitize(listId);
  const sanitizedUserId = sanitize(userId);

  List.findOneAndUpdate(
    {
      _id: sanitize(listId),
      ownerIds: { $all: [currentUserId, sanitizedUserId] }
    },
    {
      $pull: {
        ownerIds: sanitizedUserId,
        memberIds: sanitizedUserId,
        viewersIds: sanitizedUserId
      }
    }
  )
    .exec()
    .then(doc => {
      if (!doc) {
        return resp.sendStatus(400);
      }

      resp.send();

      fireAndForget(
        saveActivity(
          ActivityType.LIST_REMOVE_USER,
          currentUserId,
          null,
          sanitizedListId,
          doc.cohortId,
          sanitizedUserId
        )
      );
    })
    .catch(() => resp.sendStatus(400));
};

const removeMember = (req, resp) => {
  const { id: listId } = req.params;
  const { userId } = req.body;
  const {
    user: { _id: currentUserId }
  } = req;
  const sanitizedListId = sanitize(listId);
  const sanitizedUserId = sanitize(userId);

  List.findOneAndUpdate(
    {
      _id: sanitizedListId,
      ownerIds: currentUserId,
      viewersIds: sanitizedUserId
    },
    {
      $pull: {
        viewersIds: sanitizedUserId,
        memberIds: sanitizedUserId,
        ownerIds: sanitizedUserId,
        favIds: sanitizedUserId
      }
    }
  )
    .exec()
    .then(doc => {
      if (!doc) {
        return resp.sendStatus(400);
      }

      const data = { listId, userId };

      return returnPayload(
        socketActions.removeListMember(
          socketInstance,
          dashboardClients,
          listClients,
          cohortClients
        )(data)
      )(doc);
    })
    .then(payload => {
      fireAndForget(
        saveActivity(
          ActivityType.LIST_REMOVE_USER,
          currentUserId,
          null,
          sanitizedListId,
          payload.cohortId,
          sanitizedUserId
        )
      );

      resp.send();
    })
    .catch(() => resp.sendStatus(400));
};

const addOwnerRole = (req, resp) => {
  const { id: listId } = req.params;
  const { userId } = req.body;
  const {
    user: { _id: currentUserId }
  } = req;
  const sanitizedListId = sanitize(listId);

  List.findOne({ _id: sanitizedListId, ownerIds: currentUserId })
    .populate('cohortId', 'memberIds ownerIds')
    .exec()
    .then(doc => {
      if (!doc) {
        throw new BadRequestException();
      }

      const userIsNotAnOwner = !isOwner(doc, userId);

      if (userIsNotAnOwner) {
        doc.ownerIds.push(userId);
      }

      const userIsNotAMember = !isMember(doc, userId);

      if (userIsNotAMember) {
        doc.memberIds.push(userId);
      }

      return doc.save();
    })
    .then(doc => {
      if (!doc) {
        return resp.sendStatus(400);
      }

      const data = { listId, userId };

      return returnPayload(
        socketActions.addOwnerRoleInList(socketInstance, listClients)(data)
      )(doc);
    })
    .then(payload => {
      fireAndForget(
        saveActivity(
          ActivityType.LIST_SET_AS_OWNER,
          currentUserId,
          null,
          sanitizedListId,
          payload.cohortId,
          userId
        )
      );

      resp.send();
    })
    .catch(() => resp.sendStatus(400));
};

const removeOwnerRole = (req, resp) => {
  const { id: listId } = req.params;
  const { userId } = req.body;
  const {
    user: { _id: ownerId }
  } = req;
  const sanitizedListId = sanitize(listId);
  let list;

  List.findOne({ _id: sanitizedListId, ownerIds: ownerId })
    .exec()
    .then(doc => {
      if (!doc) {
        throw new BadRequestException();
      }

      list = doc;
      const { ownerIds } = doc;

      if (ownerIds.length < 2) {
        throw new BadRequestException(
          'list.actions.remove-owner-role-only-one-owner'
        );
      }

      if (isOwner(doc, userId)) {
        ownerIds.splice(doc.ownerIds.indexOf(userId), 1);
      }

      return doc.save();
    })
    .then(doc => {
      if (!doc) {
        return resp.sendStatus(400);
      }

      const data = { listId, userId };

      return socketActions.removeOwnerRoleInList(socketInstance, listClients)(
        data
      );
    })
    .then(() => {
      fireAndForget(
        saveActivity(
          ActivityType.LIST_SET_AS_MEMBER,
          ownerId,
          null,
          sanitizedListId,
          list.cohortId,
          userId
        )
      );

      resp.send();
    })
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { message } = err;

        return resp.status(400).send({ message });
      }

      resp.sendStatus(400);
    });
};

const addMemberRole = (req, resp) => {
  const { id: listId } = req.params;
  const { userId } = req.body;
  const {
    user: { _id: currentUserId }
  } = req;
  const sanitizedListId = sanitize(listId);

  List.findOne({ _id: sanitizedListId, ownerIds: { $in: [currentUserId] } })
    .exec()
    .then(doc => {
      if (!doc) {
        throw new BadRequestException();
      }

      const { ownerIds, memberIds } = doc;
      const userIsNotAMember = !isMember(doc, userId);

      if (userIsNotAMember) {
        memberIds.push(userId);
      }

      if (isOwner(doc, userId)) {
        ownerIds.splice(ownerIds.indexOf(userId), 1);
      }

      return doc.save();
    })
    .then(doc => {
      if (!doc) {
        return resp.sendStatus(400);
      }

      const data = { listId, userId };

      return returnPayload(
        socketActions.addMemberRoleInList(socketInstance, listClients)(data)
      )(doc);
    })
    .then(payload => {
      fireAndForget(
        saveActivity(
          ActivityType.LIST_SET_AS_MEMBER,
          currentUserId,
          null,
          sanitizedListId,
          payload.cohortId,
          userId
        )
      );

      resp.send();
    })
    .catch(() => resp.sendStatus(400));
};

const removeMemberRole = (req, resp) => {
  const { id: listId } = req.params;
  const { userId } = req.body;
  const {
    user: { _id: currentUserId }
  } = req;
  const sanitizedListId = sanitize(listId);

  List.findOne({ _id: sanitizedListId, ownerIds: { $in: [currentUserId] } })
    .populate('cohortId', 'memberIds ownerIds')
    .exec()
    .then(doc => {
      if (!doc) {
        throw new BadRequestException();
      }

      const { memberIds, ownerIds } = doc;

      const userIsOwner = isOwner(doc, userId);

      if (userIsOwner && ownerIds.length < 2) {
        throw new BadRequestException(
          'list.actions.remove-member-role-only-one-owner'
        );
      }

      if (isMember(doc, userId)) {
        memberIds.splice(memberIds.indexOf(userId), 1);
      }

      if (userIsOwner) {
        ownerIds.splice(ownerIds.indexOf(userId), 1);
      }

      return doc.save();
    })
    .then(doc => {
      if (!doc) {
        return resp.sendStatus(400);
      }

      const data = { listId, userId };

      return returnPayload(
        socketActions.removeMemberRoleInList(socketInstance, listClients)(data)
      )(doc);
    })
    .then(doc => {
      fireAndForget(
        saveActivity(
          ActivityType.LIST_SET_AS_VIEWER,
          currentUserId,
          null,
          sanitizedListId,
          doc.cohortId,
          userId
        )
      );

      resp.send();
    })
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { message } = err;

        return resp.status(400).send({ message });
      }

      resp.sendStatus(400);
    });
};

const addViewer = (req, resp) => {
  const {
    user: { _id: currentUserId, displayName, idFromProvider }
  } = req;
  const { id: listId } = req.params;
  const { email } = req.body;
  const sanitizedListId = sanitize(listId);
  let list;
  let user;
  let cohortMembers = [];
  let userToSend;

  if (idFromProvider === DEMO_MODE_ID) {
    return resp
      .status(401)
      .send({ message: 'list.actions.add-viewer-demo-mode' });
  }

  if (!email) {
    return resp.status(400).send({ message: 'Email can not be empty.' });
  }

  List.findOne({
    _id: sanitizedListId,
    memberIds: currentUserId
  })
    .populate('cohortId', 'ownerIds memberIds')
    .exec()
    .then(doc => {
      list = doc;

      return User.findOne({ email: sanitize(email) }).exec();
    })
    .then(userData => {
      if (!userData || (!userData.idFromProvider && !userData.isActive)) {
        return;
      }

      if (userData.idFromProvider === DEMO_MODE_ID) {
        throw new BadRequestException('list.actions.add-viewer-no-email');
      }

      const { _id: newMemberId } = userData;
      const { cohortId: cohort } = list;
      const userExists = isViewer(list, newMemberId);

      if (userExists) {
        throw new BadRequestException('list.actions.add-viewer-is-member');
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
        userToSend = responseWithListMember(user, cohortMembers);

        const notificationData = {
          performerName: displayName,
          resourceName: list.name
        };

        return socketActions.addListViewer(
          socketInstance,
          dashboardClients,
          cohortClients,
          onlineClients
        )({
          userToSend,
          listId,
          notificationData
        });
      }
    })
    .then(() => {
      if (user) {
        resp.send(userToSend);

        return fireAndForget(
          saveActivity(
            ActivityType.LIST_ADD_USER,
            currentUserId,
            null,
            sanitizedListId,
            list.cohortId,
            user.id
          )
        );
      }

      resp.send({ _id: null });
    })
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { message } = err;

        return resp.status(400).send({ message });
      }

      resp.sendStatus(400);
    });
};

const updateListItem = (req, res) => {
  const { description, isArchived, isOrdered, itemId, name } = req.body;
  const {
    user: { _id: userId }
  } = req;
  const { id: listId } = req.params;
  const sanitizedItemId = sanitize(itemId);
  const sanitizedListId = sanitize(listId);
  let editedItemActivity;
  let prevItemName;

  List.findOne({
    _id: sanitizedListId,
    'items._id': sanitizedItemId,
    memberIds: userId
  })
    .exec()
    .then(doc => {
      if (!doc) {
        throw new NotFoundException();
      }

      const { items } = doc;
      const itemToUpdate = items.id(sanitizedItemId);
      itemToUpdate.editedBy = userId;

      if (isDefined(description)) {
        const { description: prevDescription } = itemToUpdate;
        itemToUpdate.description = description;

        if (!description && prevDescription) {
          editedItemActivity = ActivityType.ITEM_REMOVE_DESCRIPTION;
        } else if (description && !prevDescription) {
          editedItemActivity = ActivityType.ITEM_ADD_DESCRIPTION;
        } else {
          editedItemActivity = ActivityType.ITEM_EDIT_DESCRIPTION;
        }
      }

      if (isDefined(isOrdered)) {
        itemToUpdate.isOrdered = isOrdered;
        editedItemActivity = isOrdered
          ? ActivityType.ITEM_DONE
          : ActivityType.ITEM_UNHANDLED;
      }

      if (name) {
        prevItemName = itemToUpdate.name;
        itemToUpdate.name = name;
        editedItemActivity = ActivityType.ITEM_EDIT_NAME;
      }

      if (isDefined(isArchived)) {
        itemToUpdate.isArchived = isArchived;
        editedItemActivity = isArchived
          ? ActivityType.ITEM_ARCHIVE
          : ActivityType.ITEM_RESTORE;
      }

      return doc.save();
    })
    .then(doc => {
      if (!doc) {
        return res.sendStatus(404);
      }

      fireAndForget(
        saveActivity(
          editedItemActivity,
          userId,
          sanitizedItemId,
          sanitizedListId,
          doc.cohortId,
          null,
          prevItemName
        )
      );

      return socketActions.updateItem(
        socketInstance,
        cohortClients,
        dashboardClients,
        listClients
      )({ itemId: sanitizedItemId, listId: sanitizedListId, userId });
    })
    .then(() => res.send())
    .catch(() => res.sendStatus(400));
};

const cloneItem = (req, resp) => {
  const { itemId } = req.body;
  const { id: listId } = req.params;
  const { _id: userId } = req.user;

  const sanitizedItemId = sanitize(itemId);
  const sanitizedListId = sanitize(listId);

  List.findOne({
    _id: sanitize(sanitizedListId),
    'items._id': sanitize(sanitizedItemId),
    memberIds: userId
  })
    .exec()
    .then(list => {
      if (!list) {
        throw new BadRequestException();
      }

      const { description, link, name } = list.items.id(sanitizedItemId);

      const item = new Item({
        authorId: userId,
        description,
        link,
        name
      });

      return List.findByIdAndUpdate(
        {
          _id: sanitizedListId,
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
        return resp.sendStatus(400);
      }
      const { viewersIds } = list;
      const newItem = list.items.slice(-1)[0];
      const newItemToSend = responseWithItem(newItem, userId);
      const payload = { newItemToSend, list };
      const data = { listId, item: newItemToSend, userId };

      return returnPayload(
        socketActions.cloneItem(
          socketInstance,
          cohortClients,
          dashboardClients,
          listClients,
          viewersIds
        )(data)
      )(payload);
    })
    .then(payload => {
      const { newItemToSend, list } = payload;

      fireAndForget(
        saveActivity(
          ActivityType.ITEM_CLONE,
          userId,
          newItemToSend._id,
          sanitizedListId,
          list.cohortId
        )
      );

      resp.send(newItemToSend);
    })
    .catch(() => resp.sendStatus(400));
};

const changeType = (req, resp) => {
  const { type } = req.body;
  const { id: listId } = req.params;
  const { _id: currentUserId } = req.user;
  const sanitizedListId = sanitize(listId);
  let cohortMembers;
  let removedViewers;
  let listCohortId;

  List.findOneAndUpdate(
    { _id: sanitizedListId, ownerIds: currentUserId },
    { type },
    { new: true }
  )
    .populate('cohortId', 'memberIds')
    .exec()
    .then(list => {
      if (!list) {
        throw new BadRequestException();
      }
      const {
        cohortId: { memberIds: cohortMembersCollection },
        type,
        viewersIds
      } = list;

      cohortMembers = cohortMembersCollection;

      const updatedViewersIds =
        type === ListType.LIMITED
          ? viewersIds.filter(id => isMember(list, id))
          : [...viewersIds, ...cohortMembers.filter(id => !isViewer(list, id))];

      removedViewers =
        type === ListType.LIMITED
          ? _difference(viewersIds, updatedViewersIds)
          : null;

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
        cohortId,
        memberIds,
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

      listCohortId = cohortId;
      const data = { listId, type, removedViewers };

      return returnPayload(
        socketActions.changeListType(
          socketInstance,
          dashboardClients,
          cohortClients,
          listClients
        )(data)
      )({ members, type });
    })
    .then(payload => {
      fireAndForget(
        saveActivity(
          ActivityType.LIST_CHANGE_TYPE,
          currentUserId,
          null,
          sanitizedListId,
          listCohortId,
          null,
          type
        )
      );

      resp.send(payload);
    })
    .catch(() => resp.sendStatus(400));
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
    .populate('items.editedBy', 'displayName')
    .exec()
    .then(list => {
      if (!list) {
        return resp.sendStatus(400);
      }

      const { items } = list;
      const activeItems = items.filter(item => !item.isDeleted);
      const archivedItems = activeItems.filter(item => item.isArchived);

      resp.send(responseWithItems(userId, archivedItems));
    })
    .catch(() => resp.sendStatus(400));
};

const deleteItem = (req, res) => {
  const { id: listId, itemId } = req.params;
  const { _id: userId } = req.user;
  const sanitizedItemId = sanitize(itemId);
  const sanitizedListId = sanitize(listId);

  List.findOne({
    _id: sanitizedListId,
    'items._id': sanitizedItemId,
    memberIds: userId
  })
    .exec()
    .then(doc => {
      if (!doc) {
        throw new NotFoundException();
      }

      const { items } = doc;
      const itemToUpdate = items.id(sanitizedItemId);
      const { name } = itemToUpdate;
      const data = { listId, itemId };
      const payload = { doc, name };

      itemToUpdate.isDeleted = true;

      return returnPayload(socketActions.deleteItem(socketInstance)(data))(
        payload
      );
    })
    .then(({ doc, name }) => {
      fireAndForget(
        saveActivity(
          ActivityType.ITEM_DELETE,
          userId,
          sanitizedItemId,
          sanitizedListId,
          doc.cohortId,
          null,
          name
        )
      );

      return doc.save();
    })
    .then(() => res.send())
    .catch(() => res.sendStatus(400));
};

const leaveList = (req, resp) => {
  const { id: listId } = req.params;
  const { _id: userId } = req.user;
  const sanitizedListId = sanitize(listId);

  List.findOne({
    _id: sanitizedListId,
    viewersIds: userId
  })
    .populate('cohortId', 'memberIds')
    .exec()
    .then(list => {
      if (!list) {
        throw new BadRequestException();
      }

      const { cohortId, favIds, viewersIds, memberIds, ownerIds, type } = list;

      if (type === ListType.SHARED && isMember(cohortId, userId)) {
        throw new BadRequestException();
      }

      if (isOwner(list, userId)) {
        if (ownerIds.length === 1) {
          throw new BadRequestException('list.actions.leave-one-owner');
        }

        ownerIds.splice(ownerIds.indexOf(userId), 1);
      }

      if (isMember(list, userId)) {
        memberIds.splice(memberIds.indexOf(userId), 1);
      }

      if (isViewer(list, userId)) {
        viewersIds.splice(viewersIds.indexOf(userId), 1);
      }

      if (checkIfArrayContainsUserId(favIds, userId)) {
        favIds.splice(favIds.indexOf(userId), 1);
      }

      return list.save();
    })
    .then(() => {
      const data = { listId, userId };

      return socketActions.leaveList(socketInstance)(data);
    })
    .then(() => resp.send())
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { message } = err;

        return resp.status(400).send({ message });
      }

      resp.sendStatus(400);
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
  deleteItem,
  getArchivedItems,
  getArchivedListsMetaData,
  getListData,
  getListsMetaData,
  leaveList,
  removeFromFavourites,
  removeMember,
  removeMemberRole,
  removeOwner,
  removeOwnerRole,
  updateListById,
  updateListItem,
  voteForItem
};
