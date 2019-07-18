const { CohortActionTypes } = require('../common/variables');
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
      socket.broadcast
        .to(clients.get(userId))
        .emit(CohortActionTypes.ADD_OWNER_ROLE_SUCCESS, {
          ...data,
          isCurrentUserRoleChanging: true
        });
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
      socket.broadcast
        .to(clients.get(userId))
        .emit(CohortActionTypes.REMOVE_OWNER_ROLE_SUCCESS, {
          ...data,
          isCurrentUserRoleChanging: true
        });
    }
  });
};

module.exports = {
  addCohortMember,
  addOwnerRoleInCohort,
  leaveCohort,
  removeOwnerRoleInCohort
};
