const _keyBy = require('lodash/keyBy');

const { ListType, LOCK_TIMEOUT } = require('../common/variables');
const {
  AppEvents,
  CohortActionTypes,
  CohortHeaderStatusTypes,
  ListActionTypes
} = require('./eventTypes');
const Cohort = require('../models/cohort.model');
const {
  isViewer,
  responseWithCohort,
  responseWithCohortDetails,
  responseWithListsMetaData
} = require('../common/utils');
const {
  cohortChannel,
  cohortMetaDataChannel,
  descriptionLockId,
  emitCohortMetaData,
  emitRemoveListViewer,
  emitRoleChange,
  getListsDataByViewers,
  getUserSockets,
  handleLocks,
  nameLockId,
  listChannel,
  listMetaDataChannel
} = require('./helpers');
const { isDefined } = require('../common/utils');
const List = require('../models/list.model');

const addMember = io => async data => {
  const {
    cohortId,
    member: { _id: userId }
  } = data;

  io.sockets
    .to(cohortChannel(cohortId))
    .emit(CohortActionTypes.ADD_MEMBER_SUCCESS, data);

  try {
    const cohort = await Cohort.findById(cohortId)
      .lean()
      .exec();

    const lists = await List.find(
      {
        cohortId,
        type: ListType.SHARED
      },
      '_id cohortId createdAt description favIds items memberIds name ownerIds type'
    )
      .lean()
      .populate('cohortId', 'memberIds ownerIds')
      .exec();

    const membersCount = cohort.memberIds.length;
    const socketIds = await getUserSockets(userId);

    socketIds.forEach(socketId =>
      io.sockets
        .to(socketId)
        .emit(AppEvents.JOIN_ROOM, cohortMetaDataChannel(cohortId))
    );

    io.sockets
      .to(cohortMetaDataChannel(cohortId))
      .emit(CohortActionTypes.UPDATE_SUCCESS, { cohortId, membersCount });

    socketIds.forEach(socketId =>
      io.sockets.to(socketId).emit(CohortActionTypes.FETCH_META_DATA_SUCCESS, {
        [cohortId]: responseWithCohort(cohort, userId)
      })
    );

    const listsToSend = responseWithListsMetaData(lists, userId);
    const sharedListIds = listsToSend.map(list => list._id.toString());
    const { member } = data;
    const viewer = {
      ...member,
      isMember: false,
      isViewer: true
    };
    const dataMap = _keyBy(listsToSend, '_id');

    sharedListIds.forEach(listId => {
      io.sockets
        .to(listChannel(listId))
        .emit(ListActionTypes.ADD_VIEWER_SUCCESS, {
          listId,
          viewer
        });

      socketIds.forEach(socketId =>
        io.sockets
          .to(socketId)
          .emit(AppEvents.JOIN_ROOM, listMetaDataChannel(listId))
      );
    });

    socketIds.forEach(socketId =>
      io.sockets
        .to(socketId)
        .emit(ListActionTypes.FETCH_META_DATA_SUCCESS, dataMap)
    );
  } catch (err) {
    // Ignore errors
  }
};

const leaveCohort = (io, allCohortsClients) => data => {
  const { cohortId, userId } = data;

  io.sockets
    .to(cohortChannel(cohortId))
    .emit(CohortActionTypes.REMOVE_MEMBER_SUCCESS, data);

  if (allCohortsClients.size > 0) {
    emitCohortMetaData(cohortId, allCohortsClients, io);
  }

  List.find(
    {
      cohortId,
      type: ListType.SHARED
    },
    '_id createdAt cohortId name description items favIds type'
  )
    .lean()
    .exec()
    .then(docs => {
      if (docs) {
        const sharedListIds = docs.map(list => list._id.toString());

        sharedListIds.forEach(listId =>
          io.sockets
            .to(listChannel(listId))
            .emit(ListActionTypes.REMOVE_MEMBER_SUCCESS, { listId, userId })
        );
      }
    });
};

const addOwnerRole = io => async data => {
  const { cohortId } = data;

  try {
    await emitRoleChange(io)(
      cohortChannel(cohortId),
      CohortActionTypes.ADD_OWNER_ROLE_SUCCESS
    )(data);
  } catch {
    // Ignore errors
  }

  return Promise.resolve();
};

const removeOwnerRole = io => async data => {
  const { cohortId } = data;

  try {
    await emitRoleChange(io)(
      cohortChannel(cohortId),
      CohortActionTypes.REMOVE_OWNER_ROLE_SUCCESS
    )(data);
  } catch {
    // Ignore errors
  }

  return Promise.resolve();
};

const updateCohort = io => async data => {
  const { cohortId, name } = data;

  io.sockets
    .to(cohortChannel(cohortId))
    .emit(CohortActionTypes.UPDATE_SUCCESS, data);

  io.sockets
    .to(cohortMetaDataChannel(cohortId))
    .emit(CohortActionTypes.UPDATE_SUCCESS, data);

  if (isDefined(name)) {
    try {
      const lists = await List.find(
        { cohortId, isDeleted: false },
        '_id'
      ).exec();

      lists.forEach(list =>
        io.sockets
          .to(listChannel(list._id))
          .emit(ListActionTypes.UPDATE_SUCCESS, {
            listId: list._id,
            cohortName: name
          })
      );
    } catch {
      // Ignore error
    }

    return Promise.resolve();
  }
};

const updateCohortHeaderStatus = (socket, cohortClientLocks) => {
  socket.on(CohortHeaderStatusTypes.UNLOCK, data => {
    const { cohortId, descriptionLock, nameLock, userId } = data;
    const locks = { description: descriptionLock, name: nameLock };

    handleLocks(Cohort, { _id: cohortId, ownerIds: userId })(locks).then(() => {
      socket.broadcast
        .to(cohortChannel(cohortId))
        .emit(CohortHeaderStatusTypes.UNLOCK, { cohortId, locks });

      const lock = isDefined(nameLock) ? nameLockId : descriptionLockId;

      if (cohortClientLocks.has(lock(cohortId))) {
        clearTimeout(cohortClientLocks.get(lock(cohortId)));
        cohortClientLocks.delete(lock(cohortId));
      }
    });
  });

  socket.on(CohortHeaderStatusTypes.LOCK, data => {
    const { cohortId, descriptionLock, nameLock, userId } = data;
    const locks = { description: descriptionLock, name: nameLock };

    handleLocks(Cohort, { _id: cohortId, ownerIds: userId })(locks).then(() => {
      socket.broadcast
        .to(cohortChannel(cohortId))
        .emit(CohortHeaderStatusTypes.LOCK, { cohortId, locks });

      const lock = isDefined(nameLock) ? nameLockId : descriptionLockId;
      const delayedUnlock = setTimeout(() => {
        if (isDefined(nameLock)) {
          locks.name = false;
        }

        if (isDefined(descriptionLock)) {
          locks.description = false;
        }

        handleLocks(Cohort, { _id: cohortId, ownerIds: userId })(locks).then(
          () => {
            socket.broadcast
              .to(cohortChannel(cohortId))
              .emit(CohortHeaderStatusTypes.UNLOCK, { cohortId, locks });
            clearTimeout(cohortClientLocks.get(lock(cohortId)));
            cohortClientLocks.delete(lock(cohortId));
          }
        );
      }, LOCK_TIMEOUT);

      cohortClientLocks.set(lock(cohortId), delayedUnlock);
    });
  });
};

const archiveCohort = io => async data => {
  const { cohortId, performer } = data;

  io.sockets
    .to(cohortChannel(cohortId))
    .emit(CohortActionTypes.ARCHIVE_SUCCESS, { cohortId, performer });

  io.sockets
    .to(cohortMetaDataChannel(cohortId))
    .emit(CohortActionTypes.ARCHIVE_SUCCESS, { cohortId, performer });

  try {
    const lists = await List.find({ cohortId, isDeleted: false }, '_id')
      .lean()
      .exec();

    const listIds = lists.map(list => list._id.toString());

    listIds.forEach(id => {
      const listId = id.toString();

      io.sockets
        .to(listChannel(listId))
        .emit(ListActionTypes.ARCHIVE_COHORT_SUCCESS, {
          listId,
          performer
        });

      io.sockets
        .to(listMetaDataChannel(listId))
        .emit(ListActionTypes.ARCHIVE_COHORT_SUCCESS, {
          listId
        });
    });
  } catch {
    // Ignore errors
  }

  return Promise.resolve();
};

const removeMember = io => async data => {
  const { cohortId, membersCount, performer, userId } = data;

  io.sockets
    .to(cohortChannel(cohortId))
    .emit(CohortActionTypes.REMOVE_MEMBER_SUCCESS, {
      cohortId,
      performer,
      userId
    });

  io.sockets
    .to(cohortMetaDataChannel(cohortId))
    .emit(CohortActionTypes.REMOVE_MEMBER_SUCCESS, { cohortId, userId });

  io.sockets
    .to(cohortMetaDataChannel(cohortId))
    .emit(CohortActionTypes.UPDATE_SUCCESS, { cohortId, membersCount });

  try {
    const listIdsUserRemained = [];
    const listIdsUserWasRemovedFrom = [];
    const lists = await List.find({ cohortId })
      .lean()
      .exec();

    lists.forEach(list => {
      const { type } = list;
      const listId = list._id.toString();

      if (isViewer(list, userId)) {
        listIdsUserRemained.push(listId);
      } else if (type === ListType.SHARED) {
        listIdsUserWasRemovedFrom.push(listId);
      }
    });

    listIdsUserWasRemovedFrom.forEach(async listId => {
      const data = { listId, performer, userId };
      try {
        await emitRemoveListViewer(io, CohortActionTypes.REMOVE_MEMBER_SUCCESS)(
          data
        );
      } catch {
        // Ignore errors
      }
    });

    listIdsUserRemained.foreach(listId => {
      io.sockets
        .to(listChannel(listId))
        .emit(ListActionTypes.MEMBER_UPDATE_SUCCESS, {
          isGuest: true,
          listId,
          userId
        });
    });
  } catch {
    // Ignore error
  }

  return Promise.resolve();
};

const deleteCohort = io => data => {
  const { cohortId, memberIds, performer } = data;

  io.sockets
    .to(cohortChannel(cohortId))
    .emit(CohortActionTypes.DELETE_SUCCESS, { cohortId, performer });

  io.sockets
    .to(cohortMetaDataChannel(cohortId))
    .emit(CohortActionTypes.DELETE_SUCCESS, { cohortId });

  memberIds.forEach(async id => {
    const memberId = id.toString();

    try {
      const socketIds = await getUserSockets(memberId);

      socketIds.forEach(socketId =>
        io.sockets
          .to(socketId)
          .emit(CohortActionTypes.LEAVE_ROOM, cohortMetaDataChannel(cohortId))
      );
    } catch {
      // Ignore errors
    }
  });

  return Promise.resolve();
};

const restoreCohort = (
  io,
  allCohortsClients,
  cohortClients,
  dashboardClients
) => data => {
  const { cohortId } = data;

  return Cohort.findById(cohortId)
    .populate('memberIds', 'avatarUrl displayName _id')
    .lean()
    .exec()
    .then(doc => {
      if (doc) {
        const { memberIds, ownerIds } = doc;

        ownerIds.forEach(id => {
          const ownerId = id.toString();

          if (cohortClients.has(ownerId)) {
            const { socketId, viewId } = cohortClients.get(ownerId);

            if (viewId === cohortId) {
              io.sockets
                .to(socketId)
                .emit(
                  CohortActionTypes.FETCH_DETAILS_SUCCESS,
                  responseWithCohortDetails(doc)
                );
            }
          }
        });

        memberIds.forEach(member => {
          const { _id } = member;
          const memberId = _id.toString();

          if (allCohortsClients.has(memberId)) {
            const { socketId } = allCohortsClients.get(memberId);

            io.sockets
              .to(socketId)
              .emit(CohortActionTypes.FETCH_META_DATA_SUCCESS, {
                [cohortId]: responseWithCohort(doc, memberId)
              });
          }
        });

        return List.find({ cohortId, isArchived: false })
          .populate('cohortId', 'memberIds ownerIds')
          .lean()
          .exec();
      }
    })
    .then(docs => {
      if (docs && docs.length > 0) {
        const {
          cohortId: { ownerIds: cohortOwners }
        } = docs[0];
        const listsByUsers = getListsDataByViewers(docs);

        cohortOwners.forEach(id => {
          const cohortOwnerId = id.toString();

          if (cohortClients.has(cohortOwnerId)) {
            const { socketId, viewId } = cohortClients.get(cohortOwnerId);

            if (viewId === cohortId) {
              const listsToSend = listsByUsers[cohortOwnerId];

              io.sockets
                .to(socketId)
                .emit(ListActionTypes.FETCH_META_DATA_SUCCESS, listsToSend);
            }
          }
        });

        Object.keys(listsByUsers).forEach(viewerId => {
          if (dashboardClients.has(viewerId)) {
            const { socketId } = dashboardClients.get(viewerId);
            const listsToSend = listsByUsers[viewerId];

            io.sockets
              .to(socketId)
              .emit(ListActionTypes.FETCH_META_DATA_SUCCESS, listsToSend);
          }
        });
      }
    });
};

module.exports = {
  addMember,
  addOwnerRole,
  archiveCohort,
  deleteCohort,
  leaveCohort,
  removeMember,
  removeOwnerRole,
  restoreCohort,
  updateCohort,
  updateCohortHeaderStatus
};
