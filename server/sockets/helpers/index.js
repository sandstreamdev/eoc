const List = require('../../models/list.model');
const Cohort = require('../../models/cohort.model');
const {
  ListActionTypes,
  CohortActionTypes
} = require('../../common/variables');
const { responseWithList, responseWithCohort } = require('../../common/utils');
const { isDefined } = require('../../common/utils/helpers');

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
                [listId]: list
              });
          }

          if (cohortId && cohortViewClients.has(viewerId)) {
            const { viewId, socketId } = cohortViewClients.get(viewerId);

            if (viewId === cohortId.toString()) {
              socket.broadcast
                .to(socketId)
                .emit(ListActionTypes.FETCH_META_DATA_SUCCESS, {
                  [listId]: list
                });
            }
          }
        });
      }
    });

const getListIdsByViewers = lists => {
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

const removeCohort = (socket, cohortId, clients, members) => {
  socket.broadcast
    .to(`cohort-${cohortId}`)
    .emit(CohortActionTypes.REMOVE_WHEN_COHORT_UNAVAILABLE, cohortId);

  members.forEach(id => {
    const memberId = id.toString();

    if (clients.has(memberId)) {
      const { socketId } = clients.get(memberId);

      socket.broadcast
        .to(socketId)
        .emit(CohortActionTypes.DELETE_SUCCESS, { cohortId });
    }
  });
};

const getListsDataByViewers = lists => {
  const listsByViewers = {};

  lists.forEach(list => {
    const { _id, viewersIds } = list;
    const listId = _id.toString();

    viewersIds.forEach(id => {
      const viewerId = id.toString();

      if (!listsByViewers[viewerId]) {
        listsByViewers[viewerId] = {};
      }

      if (!listsByViewers[viewerId][listId]) {
        listsByViewers[viewerId][listId] = responseWithList(list, viewerId);
      }
    });
  });

  return listsByViewers;
};

const cohortChannel = cohortId => `cohort-${cohortId}`;

const listChannel = listId => `sack-${listId}`;

const handleLocks = (model, query) => ({ description, name }) =>
  model
    .findOne(query)
    .exec()
    .then(doc => {
      if (doc) {
        const { locks } = doc;

        if (isDefined(name)) {
          locks.name = name;
        }

        if (isDefined(description)) {
          locks.description = description;
        }

        doc.save();
      }
    });

const handleItemLocks = (model, query, itemId) => ({ description, name }) =>
  model
    .findOne(query)
    .exec()
    .then(doc => {
      if (doc) {
        const { items } = doc;
        const { locks } = items.id(itemId);

        if (isDefined(name)) {
          locks.name = name;
        }

        if (isDefined(description)) {
          locks.description = description;
        }

        doc.save();
      }
    });

module.exports = {
  cohortChannel,
  emitCohortMetaData,
  getListIdsByViewers,
  getListsDataByViewers,
  handleItemLocks,
  handleLocks,
  listChannel,
  removeCohort,
  updateListOnDashboardAndCohortView
};
