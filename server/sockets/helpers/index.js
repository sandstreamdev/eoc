const List = require('../../models/list.model');
const Cohort = require('../../models/cohort.model');
const {
  ListActionTypes,
  CohortActionTypes
} = require('../../common/variables');
const { responseWithList, responseWithCohort } = require('../../common/utils');

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

const updateListOnDashboardAndCohortView = (
  socket,
  listId,
  dashboardClients,
  cohortViewClients
) => {
  List.findOne({
    _id: listId
  })
    .lean()
    .exec()
    .then(doc => {
      if (doc) {
        const { viewersIds, cohortId } = doc;
        const dashboardClientExists = dashboardClients.size > 0;

        if (dashboardClientExists) {
          viewersIds.forEach(id => {
            const viewerId = id.toString();
            const list = responseWithList(doc, id);

            if (dashboardClients.has(viewerId)) {
              // send to users that are on the dashboard view
              socket.broadcast
                .to(dashboardClients.get(viewerId))
                .emit(ListActionTypes.CREATE_SUCCESS, list);
            }
          });
        }

        if (cohortId && dashboardClientExists) {
          viewersIds.forEach(id => {
            const viewerId = id.toString();
            const currentList = responseWithList(doc, id);

            if (cohortViewClients.has(viewerId)) {
              socket.broadcast
                .to(cohortViewClients.get(viewerId))
                .emit(ListActionTypes.CREATE_SUCCESS, currentList);
            }
          });
        }
      }
    });
};

module.exports = {
  emitCohortMetaData,
  updateListOnDashboardAndCohortView
};
