const Cohort = require('../../models/cohort.model');
const List = require('../../models/list.model');
const Session = require('../../models/session.model');
const { ListEvents, CohortEvents } = require('../eventTypes');
const { responseWithList, responseWithCohort } = require('../../common/utils');
const { isDefined } = require('../../common/utils/helpers');
const { ItemStatusType, LOCK_TIMEOUT } = require('../../common/variables');

const emitCohortMetaData = (cohortId, clients, io) =>
  Cohort.findById(cohortId)
    .select('_id isArchived createdAt name description memberIds')
    .lean()
    .exec()
    .then(doc => {
      if (doc) {
        const { memberIds } = doc;
        const cohort = responseWithCohort(doc);

        memberIds.forEach(id => {
          const memberId = id.toString();

          if (clients.has(memberId)) {
            const { socketId } = clients.get(memberId);

            io.sockets.to(socketId).emit(CohortEvents.FETCH_META_DATA_SUCCESS, {
              [cohortId]: cohort
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
        listsByViewers[viewerId][listId] = responseWithList(list, viewerId);
      }
    });
  });

  return listsByViewers;
};

const cohortChannel = cohortId => `cohort-${cohortId}`;

const listChannel = listId => `sack-${listId}`;

const listMetaDataChannel = listId => `${listChannel(listId)}-metadata`;

const cohortMetaDataChannel = cohortId => `${cohortChannel(cohortId)}-metadata`;

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

const votingBroadcast = io => data => listClients => viewersIds => (
  action,
  payload
) => {
  const { listId, userId } = data;

  viewersIds.forEach(viewerId => {
    const viewerIdAsString = viewerId.toString();

    if (viewerIdAsString !== userId.toString()) {
      if (listClients.has(viewerIdAsString)) {
        const { socketId, viewId } = listClients.get(viewerIdAsString);

        if (viewId === listId) {
          io.sockets.to(socketId).emit(action, payload);
        }
      }
    }
  });

  return Promise.resolve();
};

const emitRoleChange = (io, cohortClients, data, event) => {
  const { cohortId, userId } = data;

  io.sockets.to(cohortChannel(cohortId)).emit(event, {
    ...data,
    isCurrentUserRoleChanging: false
  });

  if (cohortClients.has(userId)) {
    const { viewId, socketId } = cohortClients.get(userId);

    if (viewId === cohortId) {
      io.sockets.to(socketId).emit(event, {
        ...data,
        isCurrentUserRoleChanging: true
      });
    }
  }
};

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

const updateListOnDashboardAndCohortView = io => (
  cohortClients,
  dashboardClients
) => list => {
  const { _id: listId, cohortId, viewersIds } = list;

  viewersIds.forEach(viewerId => {
    const id = viewerId.toString();

    if (dashboardClients.has(id)) {
      const { socketId } = dashboardClients.get(id);

      io.sockets.to(socketId).emit(ListEvents.FETCH_META_DATA_SUCCESS, {
        [listId]: responseWithList(list, id)
      });
    }

    if (cohortId && cohortClients.has(id)) {
      const { socketId } = cohortClients.get(id);

      io.sockets.to(socketId).emit(ListEvents.FETCH_META_DATA_SUCCESS, {
        [listId]: responseWithList(list, id)
      });
    }
  });
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

const getUserSockets = async userId => {
  const regexp = new RegExp(userId);

  try {
    const sessions = await Session.find({ session: regexp }, 'socketId').exec();

    return sessions.map(session => session.socketId);
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
  emitRoleChange,
  getListIdsByViewers,
  getListsDataByViewers,
  getUserSockets,
  handleItemLocks,
  handleLocks,
  joinMetaDataRooms,
  listChannel,
  listMetaDataChannel,
  nameLockId,
  updateListOnDashboardAndCohortView,
  votingBroadcast
};
