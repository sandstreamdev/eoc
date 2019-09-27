const _keyBy = require('lodash/keyBy');

const { ListType, LOCK_TIMEOUT } = require('../common/variables');
const {
  CohortActionTypes,
  CohortHeaderStatusTypes,
  ListActionTypes
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
    .emit(CohortActionTypes.ADD_MEMBER_SUCCESS, data);

  if (allCohortsClients.size > 0) {
    emitCohortMetaData(cohortId, allCohortsClients, io);
  }

  return List.find(
    {
      cohortId,
      type: ListType.SHARED
    },
    '_id createdAt cohortId name description items favIds type'
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
            .emit(ListActionTypes.ADD_VIEWER_SUCCESS, {
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
            .emit(ListActionTypes.FETCH_META_DATA_SUCCESS, dataMap);
        }
      }
    });
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
      if (docs && docs.length > 0) {
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
    .emit(CohortActionTypes.REMOVE_MEMBER_SUCCESS, data);

  emitCohortMetaData(cohortId, allCohortsClients, io);

  if (cohortClients.has(removedUserId)) {
    const { viewId, socketId } = cohortClients.get(removedUserId);

    if (viewId === cohortId) {
      io.sockets.to(socketId).emit(CohortActionTypes.REMOVED_BY_SOMEONE, {
        cohortId
      });
    }
  }

  if (allCohortsClients.has(removedUserId)) {
    const { socketId } = allCohortsClients.get(removedUserId);

    io.sockets
      .to(socketId)
      .emit(CohortActionTypes.DELETE_SUCCESS, { cohortId });
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
              .emit(ListActionTypes.REMOVE_BY_IDS, listIdsUserWasRemovedFrom);
          }

          listIdsUserWasRemovedFrom.forEach(listId => {
            io.sockets
              .to(listChannel(listId))
              .emit(ListActionTypes.REMOVE_MEMBER_SUCCESS, {
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
                  .emit(ListActionTypes.REMOVED_BY_SOMEONE, {
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
                  .emit(ListActionTypes.MEMBER_UPDATE_SUCCESS, {
                    isCurrentUserUpdated: true,
                    isGuest: true,
                    listId,
                    userId
                  });
              }
            }

            io.sockets
              .to(listChannel(listId))
              .emit(ListActionTypes.MEMBER_UPDATE_SUCCESS, {
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
    .emit(CohortActionTypes.REMOVE_WHEN_COHORT_UNAVAILABLE, cohortId);

  owners.forEach(id => {
    const ownerId = id.toString();

    if (allCohortsClients.has(ownerId)) {
      const { socketId } = allCohortsClients.get(ownerId);

      io.sockets
        .to(socketId)
        .emit(CohortActionTypes.DELETE_SUCCESS, { cohortId });
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
                [cohortId]: cohortMetaData
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
