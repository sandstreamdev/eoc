const _keyBy = require('lodash/keyBy');

const { ListType, LOCK_TIMEOUT } = require('../common/variables');
const {
  CohortEventsTypes,
  CohortHeaderStatusEvents,
  ListActionEvents
} = require('./eventTypes');
const Cohort = require('../models/cohort.model');
const {
  checkIfArrayContainsUserId,
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
  emitRoleChange,
  getListsDataByViewers,
  getListIdsByViewers,
  handleLocks,
  nameLockId,
  listChannel
} = require('./helpers');
const { isDefined } = require('../common/utils');
const List = require('../models/list.model');

const addMember = (io, allCohortsClients, dashboardClients) => data => {
  const {
    cohortId,
    member: { _id: userId }
  } = data;

  io.sockets
    .to(cohortChannel(cohortId))
    .emit(CohortEventsTypes.ADD_MEMBER_SUCCESS, data);

  if (allCohortsClients.size > 0) {
    emitCohortMetaData(cohortId, allCohortsClients, io);
  }

  return List.find(
    {
      cohortId,
      type: ListType.SHARED
    },
    '_id created_at cohortId name description items favIds type'
  )
    .lean()
    .exec()
    .then(docs => {
      if (docs && docs.length > 0) {
        const lists = responseWithListsMetaData(docs, userId);
        const sharedListIds = lists.map(list => list._id.toString());
        const { member } = data;
        const viewer = {
          ...member,
          isMember: false,
          isViewer: true
        };

        sharedListIds.forEach(listId => {
          io.sockets
            .to(listChannel(listId))
            .emit(ListActionEvents.ADD_VIEWER_SUCCESS, {
              listId,
              ...viewer
            });
        });

        const id = userId.toString();

        if (dashboardClients.has(id)) {
          const { socketId } = dashboardClients.get(id);
          const dataMap = _keyBy(lists, '_id');

          io.sockets
            .to(socketId)
            .emit(ListActionEvents.FETCH_META_DATA_SUCCESS, dataMap);
        }
      }
    });
};

const leaveCohort = (io, allCohortsClients) => data => {
  const { cohortId, userId } = data;

  io.sockets
    .to(cohortChannel(cohortId))
    .emit(CohortEventsTypes.REMOVE_MEMBER_SUCCESS, data);

  if (allCohortsClients.size > 0) {
    emitCohortMetaData(cohortId, allCohortsClients, io);
  }

  List.find(
    {
      cohortId,
      type: ListType.SHARED
    },
    '_id created_at cohortId name description items favIds type'
  )
    .lean()
    .exec()
    .then(docs => {
      if (docs) {
        const sharedListIds = docs.map(list => list._id.toString());

        sharedListIds.forEach(listId =>
          io.sockets
            .to(listChannel(listId))
            .emit(ListActionEvents.REMOVE_MEMBER_SUCCESS, { listId, userId })
        );
      }
    });
};

const addOwnerRole = (io, cohortClients) => data => {
  emitRoleChange(
    io,
    cohortClients,
    data,
    CohortEventsTypes.ADD_OWNER_ROLE_SUCCESS
  );
};

const removeOwnerRole = (io, cohortClients) => data => {
  emitRoleChange(
    io,
    cohortClients,
    data,
    CohortEventsTypes.REMOVE_OWNER_ROLE_SUCCESS
  );
};

const updateCohort = io => data => {
  const { cohortId } = data;

  io.sockets
    .to(cohortChannel(cohortId))
    .emit(CohortEventsTypes.UPDATE_SUCCESS, data);

  io.sockets
    .to(cohortMetaDataChannel(cohortId))
    .emit(CohortEventsTypes.UPDATE_SUCCESS, data);

  return Promise.resolve();
};

const updateCohortHeaderStatus = (socket, cohortClientLocks) => {
  socket.on(CohortHeaderStatusEvents.UNLOCK, data => {
    const { cohortId, descriptionLock, nameLock, userId } = data;
    const locks = { description: descriptionLock, name: nameLock };

    handleLocks(Cohort, { _id: cohortId, ownerIds: userId })(locks).then(() => {
      socket.broadcast
        .to(cohortChannel(cohortId))
        .emit(CohortHeaderStatusEvents.UNLOCK, { cohortId, locks });

      const lock = isDefined(nameLock) ? nameLockId : descriptionLockId;

      if (cohortClientLocks.has(lock(cohortId))) {
        clearTimeout(cohortClientLocks.get(lock(cohortId)));
        cohortClientLocks.delete(lock(cohortId));
      }
    });
  });

  socket.on(CohortHeaderStatusEvents.LOCK, data => {
    const { cohortId, descriptionLock, nameLock, userId } = data;
    const locks = { description: descriptionLock, name: nameLock };

    handleLocks(Cohort, { _id: cohortId, ownerIds: userId })(locks).then(() => {
      socket.broadcast
        .to(cohortChannel(cohortId))
        .emit(CohortHeaderStatusEvents.LOCK, { cohortId, locks });

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
              .emit(CohortHeaderStatusEvents.UNLOCK, { cohortId, locks });
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
    .emit(CohortEventsTypes.ARCHIVE_SUCCESS, { cohortId });

  return List.find({
    cohortId
  })
    .lean()
    .exec()
    .then(docs => {
      if (docs && docs.length > 0) {
        const listIds = docs.map(list => list._id.toString());
        const listsByViewers = getListIdsByViewers(docs);
        listIds.forEach(listId => {
          io.sockets
            .to(listChannel(listId))
            .emit(ListActionEvents.REMOVE_WHEN_COHORT_UNAVAILABLE, {
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
              .emit(ListActionEvents.REMOVE_BY_IDS, listsToRemoved);
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
              .emit(CohortEventsTypes.DELETE_SUCCESS, { cohortId });
          }
        });
        ownerIds.forEach(id => {
          const ownerId = id.toString();
          if (allCohortsClients.has(ownerId)) {
            const { socketId } = allCohortsClients.get(ownerId);
            io.sockets
              .to(socketId)
              .emit(CohortEventsTypes.FETCH_META_DATA_SUCCESS, {
                [cohortId]: cohort
              });
          }
        });
      }
    });
};

const removeMember = (
  io,
  allCohortsClients,
  cohortClients,
  dashboardClients,
  listClients
) => data => {
  const { cohortId, userId } = data;
  const removedUserId = userId.toString();

  io.sockets
    .to(cohortChannel(cohortId))
    .emit(CohortEventsTypes.REMOVE_MEMBER_SUCCESS, data);

  emitCohortMetaData(cohortId, allCohortsClients, io);

  if (cohortClients.has(removedUserId)) {
    const { viewId, socketId } = cohortClients.get(removedUserId);

    if (viewId === cohortId) {
      io.sockets.to(socketId).emit(CohortEventsTypes.REMOVED_BY_SOMEONE, {
        cohortId
      });
    }
  }

  if (allCohortsClients.has(removedUserId)) {
    const { socketId } = allCohortsClients.get(removedUserId);

    io.sockets
      .to(socketId)
      .emit(CohortEventsTypes.DELETE_SUCCESS, { cohortId });
  }

  List.find({ cohortId })
    .populate('cohortId', 'memberIds')
    .lean()
    .exec()
    .then(docs => {
      if (docs && docs.length > 0) {
        const {
          cohortId: { memberIds: cohortMemberIds }
        } = docs[0];
        const listIdsUserWasRemovedFrom = [];
        const listIdsUserRemained = [];

        docs.forEach(doc => {
          const { type } = doc;
          const listId = doc._id.toString();

          if (isViewer(doc, userId)) {
            listIdsUserRemained.push(listId);
          } else if (type === ListType.SHARED) {
            listIdsUserWasRemovedFrom.push(listId);
          }
        });

        if (listIdsUserWasRemovedFrom.length > 0) {
          if (dashboardClients.has(userId)) {
            const { socketId } = dashboardClients.get(userId);

            io.sockets
              .to(socketId)
              .emit(ListActionEvents.REMOVE_BY_IDS, listIdsUserWasRemovedFrom);
          }

          listIdsUserWasRemovedFrom.forEach(listId => {
            io.sockets
              .to(listChannel(listId))
              .emit(ListActionEvents.REMOVE_MEMBER_SUCCESS, {
                listId,
                userId
              });

            if (listClients.has(userId)) {
              const { socketId, viewId } = listClients.get(userId);
              const isCohortMember = checkIfArrayContainsUserId(
                cohortMemberIds,
                userId
              );

              if (viewId === listId) {
                io.sockets
                  .to(socketId)
                  .emit(ListActionEvents.REMOVED_BY_SOMEONE, {
                    cohortId,
                    isCohortMember,
                    listId
                  });
              }
            }
          });
        }

        if (listIdsUserRemained.length > 0) {
          listIdsUserRemained.forEach(listId => {
            if (listClients.has(userId)) {
              const { socketId, viewId } = listClients.get(userId);

              if (viewId === listId) {
                io.sockets
                  .to(socketId)
                  .emit(ListActionEvents.MEMBER_UPDATE_SUCCESS, {
                    isCurrentUserUpdated: true,
                    isGuest: true,
                    listId,
                    userId
                  });
              }
            }

            io.sockets
              .to(listChannel(listId))
              .emit(ListActionEvents.MEMBER_UPDATE_SUCCESS, {
                isCurrentUserUpdated: false,
                isGuest: true,
                listId,
                userId
              });
          });
        }
      }
    });
};

const deleteCohort = (io, allCohortsClients) => data => {
  const { cohortId, owners } = data;

  io.sockets
    .to(cohortChannel(cohortId))
    .emit(CohortEventsTypes.REMOVE_WHEN_COHORT_UNAVAILABLE, cohortId);

  owners.forEach(id => {
    const ownerId = id.toString();

    if (allCohortsClients.has(ownerId)) {
      const { socketId } = allCohortsClients.get(ownerId);

      io.sockets
        .to(socketId)
        .emit(CohortEventsTypes.DELETE_SUCCESS, { cohortId });
    }
  });
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
        const cohortMetaData = responseWithCohort(doc);

        ownerIds.forEach(id => {
          const ownerId = id.toString();

          if (cohortClients.has(ownerId)) {
            const { socketId, viewId } = cohortClients.get(ownerId);

            if (viewId === cohortId) {
              io.sockets
                .to(socketId)
                .emit(
                  CohortEventsTypes.FETCH_DETAILS_SUCCESS,
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
              .emit(CohortEventsTypes.FETCH_META_DATA_SUCCESS, {
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
                .emit(ListActionEvents.FETCH_META_DATA_SUCCESS, listsToSend);
            }
          }
        });

        Object.keys(listsByUsers).forEach(viewerId => {
          if (dashboardClients.has(viewerId)) {
            const { socketId } = dashboardClients.get(viewerId);
            const listsToSend = listsByUsers[viewerId];

            io.sockets
              .to(socketId)
              .emit(ListActionEvents.FETCH_META_DATA_SUCCESS, listsToSend);
          }
        });
      }
    });
};

const createListCohort = (io, dashboardClients) => data => {
  const { cohortId, _id: listId } = data;

  io.sockets
    .to(cohortChannel(cohortId))
    .emit(ListActionEvents.FETCH_META_DATA_SUCCESS, {
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
              .emit(ListActionEvents.FETCH_META_DATA_SUCCESS, {
                [listId]: { ...data }
              });
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
  createListCohort,
  leaveCohort,
  removeMember,
  removeOwnerRole,
  restoreCohort,
  updateCohort,
  updateCohortHeaderStatus
};
