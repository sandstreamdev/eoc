const { CohortActionTypes } = require('../common/variables');
const Cohort = require('../models/cohort.model');
const { responseWithCohort } = require('../common/utils');

const addCohortMemberWS = (socket, cohortClients) =>
  socket.on(CohortActionTypes.ADD_MEMBER_SUCCESS, data => {
    const { cohortId } = data;

    // sends new cohort member to all user on this cohort view
    socket.broadcast
      .to(`cohort-${data.cohortId}`)
      .emit(CohortActionTypes.ADD_MEMBER_SUCCESS, data);

    // sends updated cohort metadata to users (which are members
    // of this cohort including the new one) on cohorts view
    if (cohortClients.size > 0) {
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

              if (cohortClients.has(memberId)) {
                socket.broadcast
                  .to(cohortClients.get(memberId))
                  .emit(CohortActionTypes.CREATE_SUCCESS, cohort);
              }
            });
          }
        });
    }
  });

module.exports = {
  addCohortMemberWS
};
