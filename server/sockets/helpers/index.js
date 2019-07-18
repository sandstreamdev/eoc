const Cohort = require('../../models/cohort.model');
const { responseWithCohort } = require('../../common/utils');
const { CohortActionTypes } = require('../../common/variables');

const emitCohortMetaData = (cohortId, clients, socket) => {
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
};

module.exports = {
  emitCohortMetaData
};
