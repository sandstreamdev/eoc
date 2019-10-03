const _compact = require('lodash/compact');

const Cohort = require('../../models/cohort.model');
const List = require('../../models/list.model');
const Session = require('../../models/session.model');
const {
  AppEvents,
  ListActionTypes,
  CohortActionTypes
} = require('../eventTypes');
const {
  countItems,
  responseWithItem,
  responseWithListMetaData,
  responseWithCohort
} = require('../../common/utils');
const { isDefined } = require('../../common/utils/helpers');
const { ItemStatusType, LOCK_TIMEOUT } = require('../../common/variables');

const emitCohortMetaData = (cohortId, clients, io) =>
  Cohort.findById(cohortId)
    .select('_id isArchived createdAt name description memberIds ownerIds')
    .lean()
    .exec()
    .then(doc => {
      if (doc) {
        const { memberIds } = doc;

        memberIds.forEach(id => {
          const memberId = id.toString();

          if (clients.has(memberId)) {
            const { socketId } = clients.get(memberId);

            io.sockets
              .to(socketId)
              .emit(CohortActionTypes.FETCH_META_DATA_SUCCESS, {
                [cohortId]: responseWithCohort(doc, memberId)
              });
          }
        });
      }
    });

const getListIdsByViewers = lists => {
  const listsByViewers = {};

  lists.forEach(list => {
    const { _id, viewersIds } = list;
    const listId = _id.toString();

    viewersIds.forEach(id => {
      const viewerId = id.toString();

      if (!listsByViewers[viewerId]) {
        listsByViewers[viewerId] = [];
      }

      if (!listsByViewers[viewerId].includes(listId)) {
        listsByViewers[viewerId].push(listId);
      }
    });
  });

  return listsByViewers;
};

const getListsDataByViewers = lists => {
  const listsByViewers = {};

  lists.forEach(list => {
    const { _id, viewersIds } = list;
    const listId = _id.toString();

    viewersIds.forEach(id => {
      const viewerId = id.toString();

      if (!listsByViewers[viewerId]) {
        listsByViewers[viewerId] = {};
      }

      if (!listsByViewers[viewerId][listId]) {
        listsByViewers[viewerId][listId] = responseWithListMetaData(
          list,
          viewerId
        );
      }
    });
  });

  return listsByViewers;
};

const cohortChannel = cohortId => `cohort-${cohortId}`;

const listChannel = listId => `sack-${listId}`;

const listMetaDataChannel = listId => `sack-meta-data-${listId}`;

const cohortMetaDataChannel = cohortId => `cohort-meta-data-${cohortId}`;

const handleLocks = (model, query) => ({ description, name }) =>
  model
    .findOne(query)
    .exec()
    .then(doc => {
      if (doc) {
        const { locks } = doc;

        if (isDefined(name)) {
          locks.name = name;
        }

        if (isDefined(description)) {
          locks.description = description;
        }

        doc.save();
      }
    });

const handleItemLocks = (model, query, itemId) => ({ description, name }) =>
  model
    .findOne(query)
    .exec()
    .then(doc => {
      if (doc) {
        const { items } = doc;
        const { locks } = items.id(itemId);

        if (isDefined(name)) {
          locks.name = name;
        }

        if (isDefined(description)) {
          locks.description = description;
        }

        doc.save();
      }
    });

const nameLockId = cohortId => `name-${cohortId}`;

const descriptionLockId = listId => `description-${listId}`;

const delayedUnlock = socket => data => itemClientLocks => locks => {
  const { itemId, listId, userId } = data;

  setTimeout(() => {
    handleItemLocks(
      List,
      {
        _id: listId,
        'items._id': itemId,
        memberIds: userId
      },
      itemId
    )(locks).then(() => {
      socket.broadcast
        .to(listChannel(listId))
        .emit(ItemStatusType.UNLOCK, { itemId, listId, locks });

      clearTimeout(itemClientLocks.get(nameLockId(itemId)));
      itemClientLocks.delete(nameLockId(itemId));
    });
  }, LOCK_TIMEOUT);
};

const associateSocketWithSession = async socket => {
  const {
    request: { sessionID },
    id: socketId
  } = socket;

  try {
    await Session.findOneAndUpdate(
      { _id: sessionID.toString() },
      { socketId }
    ).exec();
  } catch {
    // Ignore error
  }
};

const joinMetaDataRooms = async socket => {
  const {
    request: {
      user: { _id: userId }
    }
  } = socket;

  try {
    const lists = await List.find(
      { viewersIds: userId, isDeleted: false },
      '_id'
    )
      .lean()
      .exec();

    lists.forEach(list => socket.join(listMetaDataChannel(list._id)));

    const cohorts = await Cohort.find(
      {
        memberIds: userId,
        isDeleted: false
      },
      '_id'
    )
      .lean()
      .exec();

    cohorts.forEach(cohort => socket.join(cohortMetaDataChannel(cohort._id)));
  } catch {
    // Ignore error
  }
};
/**
 * Get array of all socket ids for given user.
 * @param {string} userId - current enums' namespace
 * @param {string} excludedSessionId - sessionId to exclude
 * @return {object} - array of socketIds
 */
const getUserSockets = async (userId, excludedSessionId = null) => {
  const regexp = new RegExp(userId);

  try {
    const sessions = await Session.find({ session: regexp }, 'socketId').exec();

    return _compact(
      sessions.map(session =>
        session._id !== excludedSessionId ? session.socketId : null
      )
    );
  } catch {
    // Ignore error
  }
};

const emitItemUpdate = io => event => data => {
  const { itemData, items, listId } = data;

  io.sockets.to(listChannel(listId)).emit(event, {
    ...itemData,
    listId
  });

  if (items) {
    io.sockets
      .to(listMetaDataChannel(listId))
      .emit(ListActionTypes.UPDATE_SUCCESS, { listId, ...countItems(items) });
  }
};

const emitItemPerUser = io => event => (userIds, data, sessionId = null) => {
  const { item } = data;

  userIds.forEach(async id => {
    const userId = id.toString();

    try {
      const socketIds = await getUserSockets(userId, sessionId);

      socketIds.forEach(socketId =>
        io.sockets
          .to(socketId)
          .emit(event, { ...data, item: responseWithItem(item, userId) })
      );
    } catch {
      // Ignore error
    }
  });
};

const emitVoteChange = io => event => (userIds, data, sessionId = null) => {
  const { isVoted, itemId, listId, performerId } = data;

  userIds.forEach(async id => {
    const userId = id.toString();
    const dataToSend = { itemId, listId };

    if (userId === performerId.toString()) {
      dataToSend.isVoted = isVoted;
    }

    try {
      const socketIds = await getUserSockets(userId, sessionId);

      socketIds.forEach(socketId =>
        io.sockets.to(socketId).emit(event, { ...dataToSend })
      );
    } catch {
      // Ignore error
    }
  });
};

const emitRoleChange = io => (room, event) => async data => {
  const { userId } = data;

  io.sockets.to(room).emit(event, {
    ...data,
    isCurrentUserRoleChanging: false
  });

  try {
    const socketIds = await getUserSockets(userId);

    socketIds.forEach(socketId =>
      io.sockets.to(socketId).emit(event, {
        ...data,
        isCurrentUserRoleChanging: true
      })
    );
  } catch {
    // Ignore errors
  }
};

const emitRemoveListViewer = (io, event) => async data => {
  const { listId, userId } = data;

  io.sockets.to(listChannel(listId)).emit(event, data);
  io.sockets.to(listMetaDataChannel(listId)).emit(event, data);

  try {
    const socketIds = await getUserSockets(userId);

    socketIds.forEach(socketId =>
      io.sockets
        .to(socketId)
        .emit(AppEvents.LEAVE_ROOM, listMetaDataChannel(listId))
    );
  } catch {
    // Ignore error
  }
};

module.exports = {
  associateSocketWithSession,
  cohortChannel,
  cohortMetaDataChannel,
  delayedUnlock,
  descriptionLockId,
  emitCohortMetaData,
  emitItemPerUser,
  emitItemUpdate,
  emitRemoveListViewer,
  emitRoleChange,
  emitVoteChange,
  getListIdsByViewers,
  getListsDataByViewers,
  getUserSockets,
  handleItemLocks,
  handleLocks,
  joinMetaDataRooms,
  listChannel,
  listMetaDataChannel,
  nameLockId
};
