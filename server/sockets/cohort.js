const { CohortActionTypes, ListType } = require('../common/variables');
const Cohort = require('../models/cohort.model');
const List = require('../models/list.model');
const {
  responseWithCohort,
  responseWithListsMetaData
} = require('../common/utils');

const addCohortMemberWS = (socket, cohortClients, dashboardClients) => {
  socket.on(CohortActionTypes.ADD_MEMBER_SUCCESS, data => {
    const {
      cohortId,
      json: { _id: userId }
    } = data;

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
                  .emit(CohortActionTypes.ADD_MEMBER_SUCCESS, cohort);
              }
            });
          }
        });
    }

    List.find(
      {
        cohortId,
        type: ListType.SHARED
      },
      '_id cohortId name description items favIds type'
    )
      .select()
      .lean()
      .exec()
      .then(docs => {
        if (docs) {
          const lists = responseWithListsMetaData(docs, userId);
          const sharedListIds = lists.map(list => list._id.toString());

          // sends shared lists metadata to new cohort
          // member if they are already on dashboard
          if (dashboardClients.has(userId)) {
            socket.broadcast
              .to(dashboardClients.get(userId))
              .emit(CohortActionTypes.ADD_MEMBER_SUCCESS, lists);
          }

          // sends new cohort member data to all users
          // on cohort's shared lists views
          if (sharedListIds.length > 0) {
            const { json } = data;
            const member = {
              ...json,
              isMember: false,
              isViewer: true
            };

            sharedListIds.forEach(listId => {
              socket.broadcast
                .to(`list-${listId}`)
                .emit(CohortActionTypes.ADD_MEMBER_SUCCESS, { listId, member });
            });
          }
        }
      });
  });
};

module.exports = {
  addCohortMemberWS
};
