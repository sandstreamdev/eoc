const List = require('../../models/list.model');
const Cohort = require('../../models/cohort.model');
const {
  ListActionTypes,
  CohortActionTypes
} = require('../../common/variables');
const { responseWithList, responseWithCohort } = require('../../common/utils');

const emitForMany = (users, clients, socket, event, data) => {
  users.forEach(id => {
    const userId = id.toString();

    if (clients.has(userId)) {
      socket.broadcast.to(clients.get(userId)).emit(event, data);
    }
  });
};

const emitListForMany = (users, clients, socket, event, doc) => {
  users.forEach(id => {
    const userId = id.toString();
    const list = { [doc._id]: { ...responseWithList(doc, userId) } };

    if (clients.has(userId)) {
      socket.broadcast.to(clients.get(userId)).emit(event, list);
    }
  });
};

const emitCohortMetaData = (socket, clients, cohortId) => {
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
              .emit(CohortActionTypes.FETCH_META_DATA_SUCCESS, {
                [cohortId]: { ...cohort }
              });
          }
        });
      }
    });
};

const updateListOnDashboardAndCohortView = (
  socket,
  listId,
  dashboardViewClients,
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
        const dashboardViewClientExists = dashboardViewClients.size > 0;
        const cohortViewClientsExists = cohortViewClients.size > 0;

        if (dashboardViewClientExists) {
          viewersIds.forEach(id => {
            const viewerId = id.toString();
            const list = responseWithList(doc, id);

            if (dashboardViewClients.has(viewerId)) {
              // send to users that are on the dashboard view
              socket.broadcast
                .to(dashboardViewClients.get(viewerId))
                .emit(ListActionTypes.FETCH_META_DATA_SUCCESS, {
                  [listId]: { ...list }
                });
            }
          });
        }

        if (cohortId && cohortViewClientsExists) {
          viewersIds.forEach(id => {
            const viewerId = id.toString();
            const currentList = responseWithList(doc, id);

            if (cohortViewClients.has(viewerId)) {
              socket.broadcast
                .to(cohortViewClients.get(viewerId))
                .emit(ListActionTypes.FETCH_META_DATA_SUCCESS, {
                  [listId]: { ...currentList }
                });
            }
          });
        }
      }
    });
};

module.exports = {
  emitCohortMetaData,
  emitForMany,
  emitListForMany,
  updateListOnDashboardAndCohortView
};
