const {
  CohortActionTypes,
  CohortHeaderStatusTypes
} = require('../common/variables');
const Cohort = require('../models/cohort.model');
const { responseWithCohort } = require('../common/utils');

const addCohortMember = (socket, clients) =>
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
                socket.broadcast
                  .to(allCohortsViewClients.get(memberId))
                  .emit(CohortActionTypes.UPDATE_SUCCESS, cohort);
              }
            });
          }
        });
    }
  });
};

const updateCohortHeaderStatus = socket => {
  socket.on(CohortHeaderStatusTypes.UNLOCK, data => {
    const { cohortId } = data;

    socket.broadcast
      .to(`cohort-${cohortId}`)
      .emit(CohortHeaderStatusTypes.UNLOCK, data);
  });

  socket.on(CohortHeaderStatusTypes.LOCK, data => {
    const { cohortId } = data;

    socket.broadcast
      .to(`cohort-${cohortId}`)
      .emit(CohortHeaderStatusTypes.LOCK, data);
  });
};

module.exports = {
  addCohortMember,
  updateCohort,
  updateCohortHeaderStatus
};
