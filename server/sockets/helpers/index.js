const Cohort = require('../../models/cohort.model');
const { responseWithCohort } = require('../../common/utils');
const { CohortActionTypes } = require('../../common/variables');

const emitCohortMembersCount = (
  socket,
  clients,
  cohortId,
  newMemberId = null
) => {
  Cohort.findById(cohortId)
    .select('_id isArchived createdAt name description memberIds')
    .lean()
    .exec()
    .then(doc => {
      if (doc) {
        const { memberIds } = doc;
        const cohort = responseWithCohort(doc);
        const membersCount = memberIds.length;

        memberIds.forEach(id => {
          const memberId = id.toString();

          if (clients.has(memberId)) {
            if (memberId === newMemberId) {
              socket.broadcast
                .to(clients.get(memberId))
                .emit(CohortActionTypes.FETCH_META_DATA_SUCCESS, {
                  [cohortId]: { ...cohort }
                });
            } else {
              socket.broadcast
                .to(clients.get(memberId))
                .emit(CohortActionTypes.UPDATE_SUCCESS, {
                  cohortId,
                  membersCount
                });
            }
          }
        });
      }
    });
};

module.exports = {
  emitCohortMembersCount
};
