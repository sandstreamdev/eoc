const {
  CohortActionTypes,
  CohortHeaderStatusTypes,
  ListActionTypes,
  LOCK_TIMEOUT
} = require('../common/variables');
const Cohort = require('../models/cohort.model');
const { responseWithCohort } = require('../common/utils');
const { emitCohortMetaData } = require('./helpers');

const addCohortMember = (socket, clients) =>
  socket.on(CohortActionTypes.ADD_MEMBER_SUCCESS, data => {
    const { cohortId } = data;

    socket.broadcast
      .to(`cohort-${cohortId}`)
      .emit(CohortActionTypes.ADD_MEMBER_SUCCESS, data);

    if (clients.size > 0) {
      emitCohortMetaData(cohortId, clients, socket);
    }
  });

const leaveCohort = (socket, clients) =>
  socket.on(CohortActionTypes.LEAVE_SUCCESS, data => {
    const { cohortId } = data;

    socket.broadcast
      .to(`cohort-${cohortId}`)
      .emit(CohortActionTypes.REMOVE_MEMBER_SUCCESS, data);

    if (clients.size > 0) {
      emitCohortMetaData(cohortId, clients, socket);
    }
  });

const addOwnerRoleInCohort = (socket, clients) => {
  socket.on(CohortActionTypes.ADD_OWNER_ROLE_SUCCESS, data => {
    const { cohortId, userId } = data;

    socket.broadcast
      .to(`cohort-${cohortId}`)
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
      .to(`cohort-${cohortId}`)
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
      .to(`cohort-${cohortId}`)
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
    const { cohortId, userId } = data;

    socket.broadcast
      .to(`cohort-${cohortId}`)
      .emit(CohortHeaderStatusTypes.UNLOCK, data);

    if (cohortClientLocks.has(userId)) {
      clearTimeout(cohortClientLocks.get(userId));
      cohortClientLocks.delete(userId);
    }
  });

  socket.on(CohortHeaderStatusTypes.LOCK, data => {
    const { cohortId, userId } = data;

    socket.broadcast
      .to(`cohort-${cohortId}`)
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
  });
};

const createListCohort = (socket, dashboardClients) =>
  socket.on(ListActionTypes.CREATE_SUCCESS, data => {
    const { cohortId, _id: listId } = data;

    socket.broadcast
      .to(`cohort-${cohortId}`)
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
  createListCohort,
  leaveCohort,
  removeOwnerRoleInCohort,
  updateCohort,
  updateCohortHeaderStatus
};
