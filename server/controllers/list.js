const sanitize = require('mongo-sanitize');
const _difference = require('lodash/difference');
const _some = require('lodash/some');
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
const { ActivityType, DEMO_MODE_ID, ListType } = require('../common/variables');
const Comment = require('../models/comment.model');
const { saveActivity } = require('./activity');
const io = require('../sockets/index');
const socketActions = require('../sockets/list');

const createList = async (req, resp) => {
  const { cohortId, description, name, type } = req.body;
  const {
    user: { _id: userId }
  } = req;
  const isSharedList = type === ListType.SHARED;

  if (!validator.isLength(name, { min: 1, max: 32 })) {
    return resp.sendStatus(400);
  }

  const newList = new List({
    cohortId,
    description,
    memberIds: userId,
    name,
    ownerIds: userId,
    type,
    viewersIds: userId
  });

  try {
    if (cohortId && isSharedList) {
      const cohort = await Cohort.findOne({ _id: sanitize(cohortId) }).exec();
      const { memberIds } = cohort;

      if (isMember(cohort, userId)) {
        newList.viewersIds = memberIds;
      }
    }

    const list = await newList.save();

    fireAndForget(
      saveActivity(ActivityType.LIST_ADD, userId, null, list._id, list.cohortId)
    );

    const { viewersIds } = list;
    const listData = responseWithList(list, userId);
    const socketInstance = io.getInstance();

    resp
      .status(201)
      .location(`/lists/${list._id}`)
      .send(listData);

    fireAndForget(
      socketActions.createListCohort(socketInstance)({ listData, viewersIds })
    );
  } catch {
    resp.sendStatus(400);
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

  List.find(query, '_id name createdAt description items favIds type')
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
    '_id name createdAt description type items favIds isArchived'
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

const addItemToList = async (req, resp) => {
  const {
    item: { name, authorId },
    listId
  } = req.body;
  const {
    user: { _id: userId }
  } = req;
  const sanitizedListId = sanitize(listId);

  const item = new Item({
    authorId,
    name
  });

  try {
    const list = await List.findOneAndUpdate(
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

    const { _id: listId, cohortId, items } = list;
    const newItem = items.slice(-1)[0];
    const itemToSend = responseWithItem(newItem, userId);
    const data = {
      itemData: {
        item: itemToSend
      },
      items,
      listId
    };

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
    const socketInstance = io.getInstance();

    socketActions.addItemToList(socketInstance)(data);
  } catch {
    resp.sendStatus(400);
  }
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

const voteForItem = async (req, resp) => {
  const {
    body: { itemId },
    sessionID
  } = req;
  const { id: listId } = req.params;
  const {
    user: { _id: userId }
  } = req;
  const sanitizedItemId = sanitize(itemId);
  const sanitizedListId = sanitize(listId);

  try {
    const list = await List.findOne({
      _id: sanitizedListId,
      memberIds: userId,
      'items._id': sanitizedItemId
    }).exec();

    const { items, viewersIds } = list;
    const item = items.id(sanitizedItemId);

    if (checkIfArrayContainsUserId(item.voterIds, userId)) {
      throw new Error();
    }

    item.voterIds.push(userId);

    const savedList = await list.save();
    const data = {
      itemId,
      listId,
      performerId: userId,
      sessionId: sessionID,
      viewersIds
    };

    fireAndForget(
      saveActivity(
        ActivityType.ITEM_ADD_VOTE,
        userId,
        sanitizedItemId,
        sanitizedListId,
        savedList.cohortId
      )
    );

    resp.send();
    const socketInstance = io.getInstance();

    socketActions.setVote(socketInstance)(data);
  } catch {
    resp.sendStatus(400);
  }
};

const clearVote = async (req, resp) => {
  const {
    body: { itemId },
    sessionID
  } = req;
  const { id: listId } = req.params;
  const {
    user: { _id: userId }
  } = req;
  const sanitizedItemId = sanitize(itemId);
  const sanitizedListId = sanitize(listId);

  try {
    const list = await List.findOne({
      _id: sanitizedListId,
      memberIds: userId,
      'items._id': sanitizedItemId
    }).exec();

    const { items, viewersIds } = list;
    const item = items.id(sanitizedItemId);
    const voterIdIndex = item.voterIds.indexOf(userId);
    item.voterIds.splice(voterIdIndex, 1);

    const savedList = await list.save();
    const data = {
      itemId,
      listId,
      performerId: userId,
      sessionId: sessionID,
      viewersIds
    };

    fireAndForget(
      saveActivity(
        ActivityType.ITEM_CLEAR_VOTE,
        userId,
        sanitizedItemId,
        sanitizedListId,
        savedList.cohortId
      )
    );

    resp.send();
    const socketInstance = io.getInstance();

    socketActions.clearVote(socketInstance)(data);
  } catch {
    resp.sendStatus(400);
  }
};

const archiveList = async (req, resp) => {
  const {
    user: { _id: userId }
  } = req;
  const { id: listId } = req.params;
  const sanitizedListId = sanitize(listId);

  try {
    const list = await List.findOneAndUpdate(
      {
        _id: sanitizedListId,
        ownerIds: userId
      },
      { isArchived: true },
      { new: true }
    ).exec();

    const { cohortId, memberIds, viewersIds } = list;

    fireAndForget(
      saveActivity(
        ActivityType.LIST_ARCHIVE,
        userId,
        null,
        sanitizedListId,
        cohortId,
        null,
        list.name
      )
    );

    const data = {
      cohortId,
      listId,
      viewersOnly: viewersIds.filter(id => !_some(memberIds, id))
    };
    const socketInstance = io.getInstance();

    resp.send();
    fireAndForget(socketActions.archiveList(socketInstance)(data));
  } catch {
    resp.sendStatus(400);
  }
};

const restoreList = async (req, resp) => {
  const {
    user: { _id: userId }
  } = req;
  const { id: listId } = req.params;
  const sanitizedListId = sanitize(listId);

  try {
    const list = await List.findOneAndUpdate(
      {
        _id: sanitizedListId,
        isDeleted: false,
        ownerIds: userId
      },
      { isArchived: false },
      { new: true }
    )
      .lean()
      .populate('viewersIds', 'avatarUrl displayName _id')
      .populate('items.authorId', 'displayName')
      .populate('items.editedBy', 'displayName')
      .exec();

    const { cohortId } = list;

    fireAndForget(
      saveActivity(
        ActivityType.LIST_RESTORE,
        userId,
        null,
        sanitizedListId,
        cohortId,
        null,
        list.name
      )
    );

    const cohort = cohortId
      ? await Cohort.findOne({ _id: cohortId }, 'memberIds name')
          .lean()
          .exec()
      : null;

    const data = {
      cohort,
      list,
      listId
    };
    const socketInstance = io.getInstance();

    resp.send();
    fireAndForget(socketActions.restoreList(socketInstance)(data));
  } catch {
    resp.sendStatus(400);
  }
};

const deleteList = async (req, resp) => {
  const {
    user: { _id: userId }
  } = req;
  const { id: listId } = req.params;
  const sanitizedListId = sanitize(listId);

  try {
    const list = await List.findOneAndUpdate(
      {
        _id: sanitizedListId,
        ownerIds: userId
      },
      { isDeleted: true },
      { new: true }
    ).exec();

    const { cohortId, viewersIds } = list;

    fireAndForget(
      saveActivity(
        ActivityType.LIST_DELETE,
        userId,
        null,
        sanitizedListId,
        cohortId,
        null,
        list.name
      )
    );

    const data = {
      listId: sanitizedListId,
      viewersIds
    };
    const socketInstance = io.getInstance();

    resp.send();
    fireAndForget(socketActions.deleteList(socketInstance)(data));
  } catch {
    resp.sendStatus(400);
  }
};

const updateList = async (req, resp) => {
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

  if (name !== undefined && !validator.isLength(name, { min: 1, max: 32 })) {
    return resp.sendStatus(400);
  }

  try {
    const list = await List.findOneAndUpdate(
      {
        _id: sanitizedListId,
        ownerIds: userId
      },
      dataToUpdate,
      { new: true }
    ).exec();
    const socketInstance = io.getInstance();
    const data = { listId };
    let listActivity;

    if (isDefined(description)) {
      const { description: prevDescription } = list;
      if (!description && prevDescription) {
        listActivity = ActivityType.LIST_REMOVE_DESCRIPTION;
      } else if (description && !prevDescription) {
        listActivity = ActivityType.LIST_ADD_DESCRIPTION;
      } else {
        listActivity = ActivityType.LIST_EDIT_DESCRIPTION;
      }

      data.description = description;
    }

    if (name) {
      listActivity = ActivityType.LIST_EDIT_NAME;
      data.name = name;
    }

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
    socketActions.updateList(socketInstance)(data);
  } catch {
    resp.sendStatus(400);
  }
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

      const data = {
        listId,
        performerId: currentUserId,
        userId: sanitizedUserId
      };
      const socketInstance = io.getInstance();

      return socketActions
        .removeViewer(socketInstance)(data)
        .then(() => doc);
    })
    .then(payload => {
      resp.send();

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
      const socketInstance = io.getInstance();

      return socketActions
        .removeViewer(socketInstance)(data)
        .then(() => doc);
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

const addOwnerRole = async (req, resp) => {
  const { id: listId } = req.params;
  const { userId } = req.body;
  const {
    user: { _id: currentUserId }
  } = req;
  const sanitizedListId = sanitize(listId);
  const sanitizedUserId = sanitize(userId);

  try {
    const list = await List.findOne({
      _id: sanitizedListId,
      ownerIds: currentUserId
    }).exec();

    const userIsNotAnOwner = !isOwner(list, sanitizedUserId);

    if (userIsNotAnOwner) {
      list.ownerIds.push(sanitizedUserId);
    }

    const userIsNotAMember = !isMember(list, sanitizedUserId);

    if (userIsNotAMember) {
      list.memberIds.push(sanitizedUserId);
    }

    await list.save();

    fireAndForget(
      saveActivity(
        ActivityType.LIST_SET_AS_OWNER,
        currentUserId,
        null,
        sanitizedListId,
        list.cohortId,
        sanitizedUserId
      )
    );

    const data = { listId, userId: sanitizedUserId };
    const socketInstance = io.getInstance();

    resp.send();
    fireAndForget(socketActions.addOwnerRoleInList(socketInstance)(data));
  } catch {
    resp.sendStatus(400);
  }
};

const removeOwnerRole = async (req, resp) => {
  const { id: listId } = req.params;
  const { userId } = req.body;
  const {
    user: { _id: ownerId }
  } = req;
  const sanitizedListId = sanitize(listId);
  const sanitizedUserId = sanitize(userId);

  try {
    const list = await List.findOne({
      _id: sanitizedListId,
      ownerIds: ownerId
    }).exec();

    const { ownerIds } = list;

    if (ownerIds.length < 2) {
      throw new BadRequestException(
        'list.actions.remove-owner-role-only-one-owner'
      );
    }

    if (isOwner(list, sanitizedUserId)) {
      ownerIds.splice(list.ownerIds.indexOf(sanitizedUserId), 1);
    }

    await list.save();

    fireAndForget(
      saveActivity(
        ActivityType.LIST_SET_AS_MEMBER,
        ownerId,
        null,
        sanitizedListId,
        list.cohortId,
        sanitizedUserId
      )
    );

    const data = { listId, userId: sanitizedUserId };
    const socketInstance = io.getInstance();

    resp.send();
    fireAndForget(socketActions.removeOwnerRoleInList(socketInstance)(data));
  } catch (err) {
    if (err instanceof BadRequestException) {
      const { message } = err;

      return resp.status(400).send({ message });
    }

    resp.sendStatus(400);
  }
};

const addMemberRole = async (req, resp) => {
  const { id: listId } = req.params;
  const { userId } = req.body;
  const {
    user: { _id: currentUserId }
  } = req;
  const sanitizedListId = sanitize(listId);
  const sanitizedUserId = sanitize(userId);

  try {
    const list = await List.findOne({
      _id: sanitizedListId,
      ownerIds: { $in: [currentUserId] }
    }).exec();

    const { ownerIds, memberIds } = list;
    const userIsNotAMember = !isMember(list, sanitizedUserId);

    if (userIsNotAMember) {
      memberIds.push(sanitizedUserId);
    }

    if (isOwner(list, sanitizedUserId)) {
      ownerIds.splice(ownerIds.indexOf(sanitizedUserId), 1);
    }

    await list.save();

    fireAndForget(
      saveActivity(
        ActivityType.LIST_SET_AS_MEMBER,
        currentUserId,
        null,
        sanitizedListId,
        list.cohortId,
        sanitizedUserId
      )
    );

    const data = { listId, userId: sanitizedUserId };
    const socketInstance = io.getInstance();

    resp.send();
    fireAndForget(socketActions.addMemberRoleInList(socketInstance)(data));
  } catch {
    resp.sendStatus(400);
  }
};

const removeMemberRole = async (req, resp) => {
  const { id: listId } = req.params;
  const { userId } = req.body;
  const {
    user: { _id: currentUserId }
  } = req;
  const sanitizedListId = sanitize(listId);
  const sanitizedUserId = sanitize(userId);

  try {
    const list = await List.findOne({
      _id: sanitizedListId,
      ownerIds: { $in: [currentUserId] }
    })
      .populate('cohortId', 'memberIds ownerIds')
      .exec();

    const { memberIds, ownerIds } = list;
    const userIsOwner = isOwner(list, sanitizedUserId);

    if (userIsOwner && ownerIds.length < 2) {
      throw new BadRequestException(
        'list.actions.remove-member-role-only-one-owner'
      );
    }

    if (isMember(list, sanitizedUserId)) {
      memberIds.splice(memberIds.indexOf(sanitizedUserId), 1);
    }

    if (userIsOwner) {
      ownerIds.splice(ownerIds.indexOf(sanitizedUserId), 1);
    }

    await list.save();

    fireAndForget(
      saveActivity(
        ActivityType.LIST_SET_AS_VIEWER,
        currentUserId,
        null,
        sanitizedListId,
        list.cohortId,
        sanitizedUserId
      )
    );

    const data = { listId, userId: sanitizedUserId };
    const socketInstance = io.getInstance();

    resp.send();
    fireAndForget(socketActions.removeMemberRoleInList(socketInstance)(data));
  } catch (err) {
    if (err instanceof BadRequestException) {
      const { message } = err;

      return resp.status(400).send({ message });
    }

    resp.sendStatus(400);
  }
};

const addViewer = (req, resp) => {
  const {
    user: { _id: currentUserId, idFromProvider }
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
    .then(list => {
      if (user) {
        userToSend = responseWithListMember(user, cohortMembers);
        const socketInstance = io.getInstance();

        return socketActions.addViewer(socketInstance)({
          listId,
          list: list._doc,
          userToSend
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

const markItemAsDone = async (req, resp) => {
  const { itemId } = req.body;
  const { id: listId } = req.params;
  const {
    user: { _id: userId, displayName }
  } = req;
  const sanitizedItemId = sanitize(itemId);
  const sanitizedListId = sanitize(listId);

  try {
    const list = await List.findOne({
      _id: sanitizedListId,
      'items._id': sanitizedItemId,
      memberIds: userId
    }).exec();

    const { items } = list;
    const itemToUpdate = items.id(sanitizedItemId);
    itemToUpdate.editedBy = userId;
    itemToUpdate.done = true;

    const savedList = await list.save();
    const data = {
      itemData: {
        editedBy: displayName,
        itemId: sanitizedItemId
      },
      items: savedList._doc.items,
      listId: sanitizedListId
    };

    fireAndForget(
      saveActivity(
        ActivityType.ITEM_DONE,
        userId,
        sanitizedItemId,
        sanitizedListId,
        list.cohortId,
        null,
        null
      )
    );

    resp.send();
    const socketInstance = io.getInstance();

    socketActions.markAsDone(socketInstance)(data);
  } catch {
    resp.sendStatus(400);
  }
};

const markItemAsUnhandled = async (req, resp) => {
  const { itemId } = req.body;
  const { id: listId } = req.params;
  const {
    user: { _id: userId, displayName }
  } = req;
  const sanitizedItemId = sanitize(itemId);
  const sanitizedListId = sanitize(listId);

  try {
    const list = await List.findOne({
      _id: sanitizedListId,
      'items._id': sanitizedItemId,
      memberIds: userId
    }).exec();

    const { items } = list;
    const itemToUpdate = items.id(sanitizedItemId);
    itemToUpdate.editedBy = userId;
    itemToUpdate.done = false;

    const savedList = await list.save();
    const data = {
      itemData: {
        editedBy: displayName,
        itemId: sanitizedItemId
      },
      items: savedList._doc.items,
      listId: sanitizedListId
    };

    fireAndForget(
      saveActivity(
        ActivityType.ITEM_UNHANDLED,
        userId,
        sanitizedItemId,
        sanitizedListId,
        list.cohortId,
        null,
        null
      )
    );

    resp.send();
    const socketInstance = io.getInstance();

    socketActions.markAsUnhandled(socketInstance)(data);
  } catch {
    resp.sendStatus(400);
  }
};

const archiveItem = async (req, resp) => {
  const { itemId } = req.body;
  const { id: listId } = req.params;
  const {
    user: { _id: userId, displayName }
  } = req;
  const sanitizedItemId = sanitize(itemId);
  const sanitizedListId = sanitize(listId);

  try {
    const list = await List.findOne({
      _id: sanitizedListId,
      'items._id': sanitizedItemId,
      memberIds: userId
    }).exec();

    const { items } = list;
    const itemToUpdate = items.id(sanitizedItemId);
    itemToUpdate.editedBy = userId;
    itemToUpdate.isArchived = true;

    const savedList = await list.save();
    const data = {
      itemData: {
        editedBy: displayName,
        itemId: sanitizedItemId
      },
      items: savedList._doc.items,
      listId: sanitizedListId
    };

    fireAndForget(
      saveActivity(
        ActivityType.ITEM_ARCHIVE,
        userId,
        sanitizedItemId,
        sanitizedListId,
        list.cohortId,
        null,
        null
      )
    );

    resp.send();
    const socketInstance = io.getInstance();

    socketActions.archiveItem(socketInstance)(data);
  } catch {
    resp.sendStatus(400);
  }
};

const restoreItem = async (req, resp) => {
  const { itemId } = req.body;
  const { id: listId } = req.params;
  const {
    user: { _id: userId, displayName }
  } = req;
  const sanitizedItemId = sanitize(itemId);
  const sanitizedListId = sanitize(listId);

  try {
    const list = await List.findOne({
      _id: sanitizedListId,
      memberIds: userId,
      'items._id': sanitizedItemId
    })
      .populate('items.authorId', 'displayName')
      .exec();

    const editedBy = { _id: userId, displayName };
    const { items } = list;
    const itemToUpdate = items.id(sanitizedItemId);
    itemToUpdate.editedBy = userId;
    itemToUpdate.isArchived = false;

    const savedList = await list.save();
    const data = {
      itemId: sanitizedItemId,
      item: { ...itemToUpdate._doc, editedBy },
      list: savedList._doc,
      listId: sanitizedListId
    };

    fireAndForget(
      saveActivity(
        ActivityType.ITEM_RESTORE,
        userId,
        sanitizedItemId,
        sanitizedListId,
        list.cohortId,
        null,
        null
      )
    );

    resp.send();
    const socketInstance = io.getInstance();

    await socketActions.restoreItem(socketInstance)(data);
  } catch {
    resp.sendStatus(400);
  }
};

const updateItem = async (req, resp) => {
  const { description, itemId, name } = req.body;
  const {
    user: { _id: userId, displayName }
  } = req;
  const { id: listId } = req.params;
  const sanitizedItemId = sanitize(itemId);
  const sanitizedListId = sanitize(listId);
  let editedItemActivity;
  let prevItemName = null;

  if (name !== undefined && !validator.isLength(name, { min: 1, max: 32 })) {
    return resp.sendStatus(400);
  }

  try {
    const list = await List.findOne({
      _id: sanitizedListId,
      'items._id': sanitizedItemId,
      memberIds: userId
    }).exec();

    const updatedData = { editedBy: displayName };
    const { items } = list;
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

      updatedData.description = description;
    }

    if (name) {
      prevItemName = itemToUpdate.name;
      itemToUpdate.name = name;
      editedItemActivity = ActivityType.ITEM_EDIT_NAME;
      updatedData.name = name;
    }

    await list.save();

    fireAndForget(
      saveActivity(
        editedItemActivity,
        userId,
        sanitizedItemId,
        sanitizedListId,
        list.cohortId,
        null,
        prevItemName
      )
    );

    resp.send();
    const socketInstance = io.getInstance();

    socketActions.updateItem(socketInstance)({
      itemData: {
        updatedData,
        itemId: sanitizedItemId
      },
      listId: sanitizedListId
    });
  } catch {
    resp.sendStatus(400);
  }
};

const cloneItem = async (req, resp) => {
  const { itemId } = req.body;
  const { id: listId } = req.params;
  const { _id: userId } = req.user;

  const sanitizedItemId = sanitize(itemId);
  const sanitizedListId = sanitize(listId);

  try {
    const sourceList = await List.findOne({
      _id: sanitizedListId,
      'items._id': sanitizedItemId,
      memberIds: userId
    }).exec();

    const { description, name } = sourceList.items.id(sanitizedItemId);
    const item = new Item({
      authorId: userId,
      description,
      name
    });

    const savedList = await List.findByIdAndUpdate(
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

    const newItem = savedList.items.slice(-1)[0];
    const newItemToSend = responseWithItem(newItem, userId);
    const data = {
      itemData: { item: newItemToSend },
      items: savedList.items,
      listId
    };

    fireAndForget(
      saveActivity(
        ActivityType.ITEM_CLONE,
        userId,
        newItemToSend._id,
        sanitizedListId,
        savedList.cohortId
      )
    );

    resp.send(newItemToSend);
    const socketInstance = io.getInstance();

    socketActions.cloneItem(socketInstance)(data);
  } catch {
    resp.sendStatus(400);
  }
};

const changeType = async (req, resp) => {
  const { type } = req.body;
  const { id: listId } = req.params;
  const { _id: currentUserId } = req.user;
  const sanitizedListId = sanitize(listId);
  const sanitizedType = sanitize(type);

  try {
    const list = await List.findOneAndUpdate(
      { _id: sanitizedListId, ownerIds: currentUserId },
      { type: sanitizedType },
      { new: true }
    )
      .populate('cohortId', 'memberIds')
      .exec();

    const {
      cohortId: { memberIds: cohortMembersCollection },
      type,
      viewersIds
    } = list;
    const cohortMembers = cohortMembersCollection;
    const newViewers =
      type === ListType.SHARED
        ? [...cohortMembers.filter(id => !isViewer(list, id))]
        : null;
    const updatedViewersIds =
      type === ListType.LIMITED
        ? viewersIds.filter(id => isMember(list, id))
        : [...viewersIds, ...newViewers];
    const removedViewers =
      type === ListType.LIMITED
        ? _difference(viewersIds, updatedViewersIds)
        : null;

    const updatedList = await List.findOneAndUpdate(
      { _id: listId, ownerIds: currentUserId },
      { viewersIds: updatedViewersIds },
      { new: true }
    )
      .lean()
      .populate('viewersIds', 'avatarUrl displayName _id')
      .exec();

    const { cohortId } = updatedList;

    fireAndForget(
      saveActivity(
        ActivityType.LIST_CHANGE_TYPE,
        currentUserId,
        null,
        sanitizedListId,
        cohortId,
        null,
        type
      )
    );

    const { memberIds, ownerIds, viewersIds: viewersCollection } = updatedList;
    const members = responseWithListMembers(
      viewersCollection,
      memberIds,
      ownerIds,
      cohortMembers
    );
    const data = {
      list: updatedList,
      members,
      newViewers,
      removedViewers,
      type
    };
    const socketInstance = io.getInstance();

    resp.send({ members, type });
    fireAndForget(socketActions.changeListType(socketInstance)(data));
  } catch {
    resp.sendStatus(400);
  }
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

const deleteItem = async (req, resp) => {
  const { id: listId, itemId } = req.params;
  const { _id: userId } = req.user;
  const sanitizedItemId = sanitize(itemId);
  const sanitizedListId = sanitize(listId);

  try {
    const list = await List.findOne({
      _id: sanitizedListId,
      'items._id': sanitizedItemId,
      memberIds: userId
    }).exec();

    const { items } = list;
    const itemToUpdate = items.id(sanitizedItemId);
    itemToUpdate.isDeleted = true;

    const savedList = await list.save();
    const { name } = itemToUpdate;
    const data = {
      itemData: { itemId: sanitizedItemId },
      listId
    };

    fireAndForget(
      saveActivity(
        ActivityType.ITEM_DELETE,
        userId,
        sanitizedItemId,
        sanitizedListId,
        savedList.cohortId,
        null,
        name
      )
    );

    resp.send();
    const socketInstance = io.getInstance();

    socketActions.deleteItem(socketInstance)(data);
  } catch {
    resp.sendStatus(400);
  }
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
      const socketInstance = io.getInstance();

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

const getAvailableLists = (req, resp) => {
  const {
    user: { _id: userId }
  } = req;

  const query = {
    memberIds: userId,
    isArchived: false
  };

  List.find(query, 'name')
    .lean()
    .exec()
    .then(docs => (docs ? resp.send(docs) : resp.sendStatus(400)))
    .catch(() => resp.sendStatus(400));
};

const moveItem = async (req, resp) => {
  const { itemId, newListId } = req.body;
  const { id: listId } = req.params;
  const { _id: userId } = req.user;
  const sanitizedSourceItemId = sanitize(itemId);
  const sanitizedSourceListId = sanitize(listId);
  const sanitizedTargetListId = sanitize(newListId);

  try {
    // Get source list data
    const sourceList = await List.findOne({
      _id: sanitizedSourceListId,
      memberIds: userId,
      'items._id': sanitizedSourceItemId
    }).exec();

    // Create item for target list
    const { items, name: sourceListName } = sourceList;
    const sourceItem = items.id(sanitizedSourceItemId);
    const { _id, ...dataToMove } = sourceItem._doc;
    const targetItem = new Item({
      ...dataToMove,
      locks: { description: false, name: false }
    });
    const targetItemId = targetItem._id;

    // Copy comments for moved item
    const comments = await Comment.find({ itemId: sanitizedSourceItemId })
      .lean()
      .exec();

    if (comments.length > 0) {
      await Promise.all(
        comments.map(comment => {
          const { _id, ...commentData } = comment;
          const newComment = new Comment({
            ...commentData,
            itemId: targetItemId
          });

          return newComment.save();
        })
      );
    }

    // Save moved item in target list
    await List.findOneAndUpdate(
      {
        _id: sanitizedTargetListId,
        memberIds: userId
      },
      { $push: { items: targetItem } },
      { new: true }
    ).exec();

    // Mark item as deleted in source list
    sourceItem.isDeleted = true;
    sourceItem.isArchived = true;
    const savedSourceList = await sourceList.save();

    // Get movedItem data with all populated data
    const targetList = await List.findOne({
      _id: sanitizedTargetListId,
      'items._id': targetItemId
    })
      .populate('items.authorId', 'displayName')
      .populate('items.editedBy', 'displayName')
      .exec();

    // prepare data to save activity and for socket
    const { cohortId, items: targetListItems } = targetList;
    const itemData = targetListItems.id(targetItemId)._doc;

    fireAndForget(
      saveActivity(
        ActivityType.ITEM_MOVE,
        userId,
        targetItemId,
        sanitizedTargetListId,
        cohortId,
        null,
        sourceListName
      )
    );

    // send response and emit data via socket
    resp.send();
    const socketInstance = io.getInstance();

    await socketActions.moveToList(socketInstance)({
      sourceItemId: sanitizedSourceItemId,
      movedItem: itemData,
      targetList,
      sourceList: savedSourceList
    });
  } catch {
    resp.sendStatus(400);
  }
};

module.exports = {
  addItemToList,
  addMemberRole,
  addOwnerRole,
  addToFavourites,
  addViewer,
  archiveItem,
  archiveList,
  changeType,
  clearVote,
  cloneItem,
  createList,
  deleteItem,
  deleteList,
  getArchivedItems,
  getArchivedListsMetaData,
  getAvailableLists,
  getListData,
  getListsMetaData,
  leaveList,
  markItemAsDone,
  markItemAsUnhandled,
  moveItem,
  removeFromFavourites,
  removeMember,
  removeMemberRole,
  removeOwner,
  removeOwnerRole,
  restoreItem,
  restoreList,
  updateItem,
  updateList,
  voteForItem
};
