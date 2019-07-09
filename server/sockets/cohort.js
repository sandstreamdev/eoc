const { CohortActionTypes } = require('../common/variables');
const Cohort = require('../models/cohort.model');
const { responseWithCohort } = require('../common/utils');
const noOp = require('../common/utils/noOp');

const addCohortMemberWS = (socket, clients) => {
  socket.on(CohortActionTypes.ADD_MEMBER_SUCCESS, data => {
    socket.broadcast
      .to(`cohort-${data.cohortId}`)
      .emit(CohortActionTypes.ADD_MEMBER_SUCCESS, data);

    const { cohortId } = data;

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
              const userId = id.toString();

              if (clients.has(userId)) {
                socket.broadcast
                  .to(clients.get(userId))
                  .emit(CohortActionTypes.ADD_MEMBER_SUCCESS, cohort);
              }
            });
          }
        })
        .catch(noOp);
    }
  });
};

module.exports = {
  addCohortMemberWS
};
