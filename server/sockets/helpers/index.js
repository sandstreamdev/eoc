const List = require('../../models/list.model');
const { ListActionTypes } = require('../../common/variables');
const { responseWithList } = require('../../common/utils');

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

      if (cohortId && cohortViewClients) {
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
    });
};

module.exports = { updateListOnDashboardAndCohortView };
