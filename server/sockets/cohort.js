const { CohortActionTypes } = require('../common/variables');
const Cohort = require('../models/cohort.model');
const { responseWithCohort } = require('../common/utils');

const addCohortMemberWS = (socket, clients) =>
  socket.on(CohortActionTypes.ADD_MEMBER_SUCCESS, data => {
    const { cohortId } = data;

    socket.broadcast
      .to(`cohort-${cohortId}`)
      .emit(CohortActionTypes.ADD_MEMBER_SUCCESS, data);

    if (clients.size > 0) {
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
                socket.broadcast
                  .to(clients.get(memberId))
                  .emit(CohortActionTypes.CREATE_SUCCESS, cohort);
              }
            });
          }
        });
    }
  });

const addOwnerRoleInCohortWS = (socket, clients) => {
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

const removeOwnerRoleInCohortWS = (socket, clients) => {
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
  addCohortMemberWS,
  addOwnerRoleInCohortWS,
  removeOwnerRoleInCohortWS
};
