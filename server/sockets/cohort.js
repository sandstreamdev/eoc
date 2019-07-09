const { CohortActionTypes } = require('../common/variables');

const addCohortMemberWS = socket => {
  socket.on(CohortActionTypes.ADD_MEMBER_SUCCESS, data => {
    socket.broadcast
      .to(`cohort-${data.cohortId}`)
      .emit(CohortActionTypes.ADD_MEMBER_SUCCESS, data);
  });
};

module.exports = {
  addCohortMemberWS
};
