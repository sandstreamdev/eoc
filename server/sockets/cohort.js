const {
  CohortActionTypes,
  CohortHeaderStatusTypes,
  ListActionTypes,
  LOCK_TIMEOUT
} = require('../common/variables');
const Cohort = require('../models/cohort.model');
const {
  responseWithCohort,
  responseWithCohortDetails
} = require('../common/utils');
const {
  cohortChannel,
  descriptionLockId,
  emitCohortMetaData,
  getListsDataByViewers,
  getListIdsByViewers,
  handleLocks,
  nameLockId,
  listChannel,
  removeCohort
} = require('./helpers');
const { isDefined } = require('../common/utils');
const List = require('../models/list.model');

const addCohortMember = (socket, clients) =>
  socket.on(CohortActionTypes.ADD_MEMBER_SUCCESS, data => {
    const { cohortId } = data;

    socket.broadcast
      .to(cohortChannel(cohortId))
      .emit(CohortActionTypes.ADD_MEMBER_SUCCESS, data);

    if (clients.size > 0) {
      emitCohortMetaData(cohortId, clients, socket);
    }
  });

const leaveCohort = (socket, clients) =>
  socket.on(CohortActionTypes.LEAVE_SUCCESS, data => {
    const { cohortId } = data;

    socket.broadcast
      .to(cohortChannel(cohortId))
      .emit(CohortActionTypes.REMOVE_MEMBER_SUCCESS, data);

    if (clients.size > 0) {
      emitCohortMetaData(cohortId, clients, socket);
    }
  });

const addOwnerRoleInCohort = (socket, clients) => {
  socket.on(CohortActionTypes.ADD_OWNER_ROLE_SUCCESS, data => {
    const { cohortId, userId } = data;

    socket.broadcast
      .to(cohortChannel(cohortId))
      .emit(CohortActionTypes.ADD_OWNER_ROLE_SUCCESS, {
        ...data,
        isCurrentUserRoleChanging: false
      });

    if (clients.has(userId)) {
      const { viewId, socketId } = clients.get(userId);

      if (viewId === cohortId) {
        socket.broadcast
          .to(socketId)
          .emit(CohortActionTypes.ADD_OWNER_ROLE_SUCCESS, {
            ...data,
            isCurrentUserRoleChanging: true
          });
      }
    }
  });
};

const removeOwnerRoleInCohort = (socket, clients) => {
  socket.on(CohortActionTypes.REMOVE_OWNER_ROLE_SUCCESS, data => {
    const { cohortId, userId } = data;

    socket.broadcast
      .to(cohortChannel(cohortId))
      .emit(CohortActionTypes.REMOVE_OWNER_ROLE_SUCCESS, {
        ...data,
        isCurrentUserRoleChanging: false
      });

    if (clients.has(userId)) {
      const { viewId, socketId } = clients.get(userId);

      if (viewId === cohortId) {
        socket.broadcast
          .to(socketId)
          .emit(CohortActionTypes.REMOVE_OWNER_ROLE_SUCCESS, {
            ...data,
            isCurrentUserRoleChanging: true
          });
      }
    }
  });
};

const updateCohort = (io, allCohortsViewClients) => data => {
  const { cohortId } = data;

  io.sockets
    .to(cohortChannel(cohortId))
    .emit(CohortActionTypes.UPDATE_SUCCESS, data);

  if (allCohortsViewClients.size > 0) {
    Cohort.findOne({
      _id: cohortId
    })
      .lean()
      .exec()
      .then(doc => {
        if (doc) {
          const { memberIds } = doc;
          const cohort = responseWithCohort(doc);

          memberIds.forEach(id => {
            const memberId = id.toString();

            if (allCohortsViewClients.has(memberId)) {
              const { socketId } = allCohortsViewClients.get(memberId);

              io.sockets
                .to(socketId)
                .emit(CohortActionTypes.UPDATE_SUCCESS, cohort);
            }
          });
        }
      });
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

const archiveCohort = (io, allCohortsClients, dashboardClients) => data => {
  const { cohortId } = data;

  io.sockets
    .to(cohortChannel(cohortId))
    .emit(CohortActionTypes.ARCHIVE_SUCCESS, { cohortId });

  return List.find({
    cohortId
  })
    .lean()
    .exec()
    .then(docs => {
      if (docs) {
        const listIds = docs.map(list => list._id.toString());
        const listsByViewers = getListIdsByViewers(docs);
        listIds.forEach(listId => {
          io.sockets
            .to(listChannel(listId))
            .emit(ListActionTypes.REMOVE_WHEN_COHORT_UNAVAILABLE, {
              cohortId,
              listId
            });
        });
        Object.keys(listsByViewers).forEach(viewerId => {
          if (dashboardClients.has(viewerId)) {
            const { socketId } = dashboardClients.get(viewerId);
            const listsToRemoved = listsByViewers[viewerId];
            io.sockets
              .to(socketId)
              .emit(ListActionTypes.REMOVE_BY_IDS, listsToRemoved);
          }
        });

        return Cohort.findOne({
          _id: cohortId
        })
          .lean()
          .exec();
      }
    })
    .then(doc => {
      if (doc) {
        const { memberIds, ownerIds } = doc;
        const cohort = responseWithCohort(doc);
        memberIds.forEach(id => {
          const memberId = id.toString();
          if (allCohortsClients.has(memberId)) {
            const { socketId } = allCohortsClients.get(memberId);
            io.sockets
              .to(socketId)
              .emit(CohortActionTypes.DELETE_SUCCESS, { cohortId });
          }
        });
        ownerIds.forEach(id => {
          const ownerId = id.toString();
          if (allCohortsClients.has(ownerId)) {
            const { socketId } = allCohortsClients.get(ownerId);
            io.sockets
              .to(socketId)
              .emit(CohortActionTypes.FETCH_META_DATA_SUCCESS, {
                [cohortId]: cohort
              });
          }
        });
      }
    });
};

const removeCohortMember = (socket, allCohortsClients, cohortClients) =>
  socket.on(CohortActionTypes.REMOVE_MEMBER_SUCCESS, data => {
    const { cohortId, userId } = data;

    socket.broadcast
      .to(cohortChannel(cohortId))
      .emit(CohortActionTypes.REMOVE_MEMBER_SUCCESS, data);

    emitCohortMetaData(cohortId, allCohortsClients, socket);

    if (cohortClients.has(userId)) {
      const { viewId, socketId } = cohortClients.get(userId);

      if (viewId === cohortId) {
        socket.broadcast
          .to(socketId)
          .emit(CohortActionTypes.REMOVED_BY_SOMEONE, {
            cohortId
          });
      }
    }

    if (allCohortsClients.has(userId)) {
      const { socketId } = allCohortsClients.get(userId);

      socket.broadcast
        .to(socketId)
        .emit(CohortActionTypes.DELETE_SUCCESS, { cohortId });
    }
  });

const deleteCohort = (socket, allCohortsClients) =>
  socket.on(CohortActionTypes.DELETE_SUCCESS, data => {
    const { cohortId, members } = data;

    removeCohort(socket, cohortId, allCohortsClients, members);
  });

const restoreCohort = (
  io,
  allCohortsClients,
  cohortClients,
  dashboardClients
) => data => {
  const { cohortId } = data;

  Cohort.findById(cohortId)
    .populate('memberIds', 'avatarUrl displayName _id')
    .lean()
    .exec()
    .then(doc => {
      if (doc) {
        const { memberIds, ownerIds } = doc;
        const cohortMetaData = responseWithCohort(doc);

        ownerIds.forEach(id => {
          const ownerId = id.toString();

          if (cohortClients.has(ownerId)) {
            const { socketId, viewId } = cohortClients.get(ownerId);

            if (viewId === cohortId) {
              io.sockets
                .to(socketId)
                .emit(
                  CohortActionTypes.FETCH_DETAILS_SUCCESS,
                  responseWithCohortDetails(doc, ownerId)
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
                [cohortId]: cohortMetaData
              });
          }
        });

        return List.find({ cohortId, isArchived: false })
          .populate('cohortId', 'ownerIds')
          .lean()
          .exec();
      }
    })
    .then(docs => {
      if (docs) {
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

const createListCohort = (io, dashboardClients) => data => {
  const { cohortId, _id: listId } = data;

  io.sockets
    .to(cohortChannel(cohortId))
    .emit(ListActionTypes.FETCH_META_DATA_SUCCESS, {
      [listId]: { ...data }
    });

  return Cohort.findById(cohortId)
    .select('memberIds')
    .lean()
    .exec()
    .then(doc => {
      if (doc) {
        const { memberIds } = doc;

        memberIds.forEach(id => {
          const memberId = id.toString();

          if (dashboardClients.has(memberId)) {
            const { socketId } = dashboardClients.get(memberId);

            io.sockets
              .to(socketId)
              .emit(ListActionTypes.FETCH_META_DATA_SUCCESS, {
                [listId]: { ...data }
              });
          }
        });
      }
    });
};

module.exports = {
  addCohortMember,
  addOwnerRoleInCohort,
  archiveCohort,
  deleteCohort,
  createListCohort,
  leaveCohort,
  removeCohortMember,
  removeOwnerRoleInCohort,
  restoreCohort,
  updateCohort,
  updateCohortHeaderStatus
};
