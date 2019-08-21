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
  emitCohortMetaData,
  handleLocks,
  removeCohort
} = require('./helpers');

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

const updateCohort = (socket, allCohortsViewClients) => {
  socket.on(CohortActionTypes.UPDATE_SUCCESS, data => {
    const { cohortId } = data;

    socket.broadcast
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

                socket.broadcast
                  .to(socketId)
                  .emit(CohortActionTypes.UPDATE_SUCCESS, cohort);
              }
            });
          }
        });
    }
  });
};

const updateCohortHeaderStatus = (socket, cohortClientLocks) => {
  socket.on(CohortHeaderStatusTypes.UNLOCK, data => {
    const {
      cohortId,
      descriptionLock: description,
      nameLock: name,
      userId
    } = data;

    socket.broadcast
      .to(cohortChannel(cohortId))
      .emit(CohortHeaderStatusTypes.UNLOCK, data);

    if (cohortClientLocks.has(userId)) {
      clearTimeout(cohortClientLocks.get(userId));
      cohortClientLocks.delete(userId);
    }

    handleLocks(Cohort, { _id: cohortId })({ description, name });
  });

  socket.on(CohortHeaderStatusTypes.LOCK, data => {
    const {
      cohortId,
      descriptionLock: description,
      nameLock: name,
      userId
    } = data;

    socket.broadcast
      .to(cohortChannel(cohortId))
      .emit(CohortHeaderStatusTypes.LOCK, data);

    const delayedUnlock = setTimeout(() => {
      const { cohortId, nameLock, descriptionLock } = data;
      const updatedData = { cohortId };

      if (nameLock !== undefined) {
        updatedData.nameLock = false;
      }

      if (descriptionLock !== undefined) {
        updatedData.descriptionLock = false;
      }

      socket.broadcast
        .to(`cohort-${cohortId}`)
        .emit(CohortHeaderStatusTypes.UNLOCK, updatedData);

      cohortClientLocks.delete(userId);
    }, LOCK_TIMEOUT);

    cohortClientLocks.set(userId, delayedUnlock);

    handleLocks(Cohort, { _id: cohortId })({ description, name });
  });
};

const archiveCohort = (socket, allCohortsClients) =>
  socket.on(CohortActionTypes.ARCHIVE_SUCCESS, data => {
    const { cohortId } = data;

    socket.broadcast
      .to(cohortChannel(cohortId))
      .emit(CohortActionTypes.ARCHIVE_SUCCESS, { cohortId });

    Cohort.findOne({
      _id: cohortId
    })
      .lean()
      .exec()
      .then(doc => {
        if (doc) {
          const { memberIds, ownerIds } = doc;
          const cohort = responseWithCohort(doc);

          memberIds.forEach(id => {
            const memberId = id.toString();

            if (allCohortsClients.has(memberId)) {
              const { socketId } = allCohortsClients.get(memberId);

              socket.broadcast
                .to(socketId)
                .emit(CohortActionTypes.DELETE_SUCCESS, { cohortId });
            }
          });

          ownerIds.forEach(id => {
            const ownerId = id.toString();

            if (allCohortsClients.has(ownerId)) {
              const { socketId } = allCohortsClients.get(ownerId);

              socket.broadcast
                .to(socketId)
                .emit(CohortActionTypes.FETCH_META_DATA_SUCCESS, {
                  [cohortId]: cohort
                });
            }
          });
        }
      });
  });

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

const restoreCohort = (socket, allCohortsClients, cohortClients) =>
  socket.on(CohortActionTypes.RESTORE_SUCCESS, data => {
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
              const { socketId } = cohortClients.get(ownerId);

              socket.broadcast
                .to(socketId)
                .emit(
                  CohortActionTypes.FETCH_DETAILS_SUCCESS,
                  responseWithCohortDetails(doc, ownerId)
                );
            }
          });

          memberIds.forEach(member => {
            const { _id } = member;
            const memberId = _id.toString();

            if (allCohortsClients.has(memberId)) {
              const { socketId } = allCohortsClients.get(memberId);

              socket.broadcast
                .to(socketId)
                .emit(CohortActionTypes.FETCH_META_DATA_SUCCESS, {
                  [cohortId]: cohortMetaData
                });
            }
          });
        }
      });
  });

const createListCohort = (socket, dashboardClients) =>
  socket.on(ListActionTypes.CREATE_SUCCESS, data => {
    const { cohortId, _id: listId } = data;

    socket.broadcast
      .to(cohortChannel(cohortId))
      .emit(ListActionTypes.FETCH_META_DATA_SUCCESS, {
        [listId]: { ...data }
      });

    Cohort.findById(cohortId)
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

              socket.broadcast
                .to(socketId)
                .emit(ListActionTypes.FETCH_META_DATA_SUCCESS, {
                  [listId]: { ...data }
                });
            }
          });
        }
      });
  });

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
