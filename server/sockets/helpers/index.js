const List = require('../../models/list.model');
const { ListActionTypes } = require('../../common/variables');
const Cohort = require('../../models/cohort.model');
const { responseWithList } = require('../../common/utils');

const updateListOnDashboardAndCohortView = (
  socket,
  listId,
  dashboardClients
) => {
  List.findOne({
    _id: listId
  })
    .lean()
    .exec()
    .then(doc => {
      const { viewersIds, cohortId } = doc;

      if (dashboardClients.size > 0) {
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

      if (cohortId) {
        Cohort.findOne({ _id: cohortId })
          .lean()
          .exec()
          .then(cohort => {
            if (cohort) {
              const { memberIds } = cohort;

              memberIds.forEach(id => {
                const currentList = responseWithList(doc, id);

                // send to users that are on cohort view
                socket.broadcast
                  .to(`cohort-${cohortId}`)
                  .emit(ListActionTypes.CREATE_SUCCESS, currentList);
              });
            }
          });
      }
    });
};

module.exports = { updateListOnDashboardAndCohortView };
