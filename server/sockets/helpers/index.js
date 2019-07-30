const List = require('../../models/list.model');
const Cohort = require('../../models/cohort.model');
const {
  ListActionTypes,
  CohortActionTypes
} = require('../../common/variables');
const { responseWithList, responseWithCohort } = require('../../common/utils');

const emitCohortMetaData = (cohortId, clients, socket) =>
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
            const { socketId } = clients.get(memberId);

            socket.broadcast
              .to(socketId)
              .emit(CohortActionTypes.FETCH_META_DATA_SUCCESS, {
                [cohortId]: cohort
              });
          }
        });
      }
    });

const updateListOnDashboardAndCohortView = (
  socket,
  listId,
  dashboardClients,
  cohortViewClients
) =>
  List.findOne({
    _id: listId
  })
    .lean()
    .exec()
    .then(doc => {
      if (doc) {
        const { viewersIds, cohortId } = doc;

        viewersIds.forEach(id => {
          const viewerId = id.toString();
          const list = responseWithList(doc, id);

          if (dashboardClients.has(viewerId)) {
            const { socketId } = dashboardClients.get(viewerId);

            socket.broadcast
              .to(socketId)
              .emit(ListActionTypes.FETCH_META_DATA_SUCCESS, {
                [listId]: { ...list }
              });
          }

          if (cohortId && cohortViewClients.has(viewerId)) {
            const { viewId, socketId } = cohortViewClients.get(viewerId);

            if (viewId === cohortId.toString()) {
              socket.broadcast
                .to(socketId)
                .emit(ListActionTypes.FETCH_META_DATA_SUCCESS, {
                  [listId]: { ...list }
                });
            }
          }
        });
      }
    });

const getListsByViewers = lists => {
  const listsByViewers = {};

  lists.forEach(list => {
    const { _id, viewersIds } = list;
    const listId = _id.toString();

    viewersIds.forEach(id => {
      const viewerId = id.toString();

      if (!listsByViewers[viewerId]) {
        listsByViewers[viewerId] = [];
      }

      if (!listsByViewers[viewerId].includes(listId)) {
        listsByViewers[viewerId].push(listId);
      }
    });
  });

  return listsByViewers;
};

module.exports = {
  emitCohortMetaData,
  getListsByViewers,
  updateListOnDashboardAndCohortView
};
