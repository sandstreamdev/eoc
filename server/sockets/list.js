const _keyBy = require('lodash/keyBy');

const {
  ItemActionTypes,
  ItemStatusType,
  CohortActionTypes,
  CommentActionTypes,
  ListActionTypes,
  ListType
} = require('../common/variables');
const List = require('../models/list.model');
const Cohort = require('../models/cohort.model');
const {
  responseWithList,
  responseWithListsMetaData
} = require('../common/utils');

const addItemToList = socket => {
  socket.on(ItemActionTypes.ADD_SUCCESS, data => {
    socket.broadcast
      .to(`sack-${data.listId}`)
      .emit(ItemActionTypes.ADD_SUCCESS, data);
  });
};

const archiveItem = socket => {
  socket.on(ItemActionTypes.ARCHIVE_SUCCESS, data => {
    socket.broadcast
      .to(`sack-${data.listId}`)
      .emit(ItemActionTypes.ARCHIVE_SUCCESS, data);
  });
};

const deleteItem = socket => {
  socket.on(ItemActionTypes.DELETE_SUCCESS, data => {
    socket.broadcast
      .to(`sack-${data.listId}`)
      .emit(ItemActionTypes.DELETE_SUCCESS, data);
  });
};

const restoreItem = socket => {
  socket.on(ItemActionTypes.RESTORE_SUCCESS, data => {
    socket.broadcast
      .to(`sack-${data.listId}`)
      .emit(ItemActionTypes.RESTORE_SUCCESS, data);
  });
};

const updateItemState = socket => {
  socket.on(ItemStatusType.LOCK, data => {
    const { listId } = data;

    socket.broadcast.to(`sack-${listId}`).emit(ItemStatusType.LOCK, data);
  });

  socket.on(ItemStatusType.UNLOCK, data => {
    const { listId } = data;

    socket.broadcast.to(`sack-${listId}`).emit(ItemStatusType.UNLOCK, data);
  });
};

const updateItem = socket => {
  socket.on(ItemActionTypes.UPDATE_SUCCESS, data =>
    socket.broadcast
      .to(`sack-${data.listId}`)
      .emit(ItemActionTypes.UPDATE_SUCCESS, data)
  );
};

const addComment = socket =>
  socket.on(CommentActionTypes.ADD_SUCCESS, data =>
    socket.broadcast
      .to(`sack-${data.listId}`)
      .emit(CommentActionTypes.ADD_SUCCESS, data)
  );

const cloneItem = socket =>
  socket.on(ItemActionTypes.CLONE_SUCCESS, data =>
    socket.broadcast
      .to(`sack-${data.listId}`)
      .emit(ItemActionTypes.CLONE_SUCCESS, data)
  );

const emitListsOnAddCohortMember = (socket, clients) =>
  socket.on(CohortActionTypes.ADD_MEMBER_SUCCESS, data => {
    const {
      cohortId,
      member: { _id: userId }
    } = data;

    List.find(
      {
        cohortId,
        type: ListType.SHARED
      },
      '_id created_at cohortId name description items favIds type'
    )
      .lean()
      .exec()
      .then(docs => {
        if (docs) {
          const lists = responseWithListsMetaData(docs, userId);
          const sharedListIds = lists.map(list => list._id.toString());
          const { member } = data;
          const viewer = {
            ...member,
            isMember: false,
            isViewer: true
          };

          sharedListIds.forEach(listId => {
            socket.broadcast
              .to(`sack-${listId}`)
              .emit(ListActionTypes.ADD_VIEWER_SUCCESS, { listId, viewer });
          });

          if (clients.has(userId)) {
            const dataMap = _keyBy(lists, '_id');
            socket.broadcast
              .to(clients.get(userId))
              .emit(ListActionTypes.FETCH_META_DATA_SUCCESS, dataMap);
          }
        }
      });
  });

const addListMember = (socket, dashboardClients, cohortClients) =>
  socket.on(ListActionTypes.ADD_VIEWER_SUCCESS, data => {
    const {
      listId,
      viewer: { _id: viewerId }
    } = data;

    socket.broadcast
      .to(`sack-${listId}`)
      .emit(ListActionTypes.ADD_VIEWER_SUCCESS, data);

    List.findById(listId)
      .lean()
      .exec()
      .then(doc => {
        if (doc) {
          const { cohortId } = doc;
          const list = responseWithList(doc, viewerId);

          if (cohortId && cohortClients.has(viewerId)) {
            socket
              .to(cohortClients.get(viewerId))
              .emit(ListActionTypes.FETCH_META_DATA_SUCCESS, {
                [listId]: { ...list }
              });
          }

          if (dashboardClients.has(viewerId)) {
            socket
              .to(dashboardClients.get(viewerId))
              .emit(ListActionTypes.FETCH_META_DATA_SUCCESS, {
                [listId]: { ...list }
              });
          }
        }
      });
  });

const setVote = socket =>
  socket.on(ItemActionTypes.SET_VOTE_SUCCESS, data =>
    socket.broadcast
      .to(`sack-${data.listId}`)
      .emit(ItemActionTypes.SET_VOTE_SUCCESS, data)
  );
const clearVote = socket =>
  socket.on(ItemActionTypes.CLEAR_VOTE_SUCCESS, data =>
    socket.broadcast
      .to(`sack-${data.listId}`)
      .emit(ItemActionTypes.CLEAR_VOTE_SUCCESS, data)
  );

const changeOrderState = (socket, dashboardClients) => {
  socket.on(ItemActionTypes.TOGGLE_SUCCESS, data => {
    const { listId } = data;

    // send to users that are on the list view
    socket.broadcast
      .to(`sack-${data.listId}`)
      .emit(ItemActionTypes.TOGGLE_SUCCESS, data);

    List.findOne({
      _id: listId
    })
      .lean()
      .exec()
      .then(doc => {
        if (doc) {
          const { viewersIds, cohortId, items } = doc;
          const doneItemsCount = items.filter(item => item.isOrdered).length;
          const unhandledItemsCount = items.length - doneItemsCount;
          const dataToUpdate = {
            listId,
            doneItemsCount,
            unhandledItemsCount
          };

          if (dashboardClients.size > 0) {
            viewersIds.forEach(id => {
              const viewerId = id.toString();

              if (dashboardClients.has(viewerId)) {
                // send to users that are on the dashboard view
                socket.broadcast
                  .to(dashboardClients.get(viewerId))
                  .emit(ListActionTypes.UPDATE_SUCCESS, dataToUpdate);
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

                  memberIds.forEach(() => {
                    // send to users that are on cohort view
                    socket.broadcast
                      .to(`cohort-${cohortId}`)
                      .emit(ListActionTypes.UPDATE_SUCCESS, dataToUpdate);
                  });
                }
              });
          }
        }
      });
  });
};

const addMemberRoleInList = (socket, clients) => {
  socket.on(ListActionTypes.ADD_MEMBER_ROLE_SUCCESS, data => {
    const { listId, userId } = data;

    socket.broadcast
      .to(`sack-${listId}`)
      .emit(ListActionTypes.ADD_MEMBER_ROLE_SUCCESS, {
        ...data,
        isCurrentUserRoleChanging: false
      });

    if (clients.has(userId)) {
      socket.broadcast
        .to(clients.get(userId))
        .emit(ListActionTypes.ADD_MEMBER_ROLE_SUCCESS, {
          ...data,
          isCurrentUserRoleChanging: true
        });
    }
  });
};

const addOwnerRoleInList = (socket, clients) => {
  socket.on(ListActionTypes.ADD_OWNER_ROLE_SUCCESS, data => {
    const { listId, userId } = data;

    socket.broadcast
      .to(`sack-${listId}`)
      .emit(ListActionTypes.ADD_OWNER_ROLE_SUCCESS, {
        ...data,
        isCurrentUserRoleChanging: false
      });

    if (clients.has(userId)) {
      socket.broadcast
        .to(clients.get(userId))
        .emit(ListActionTypes.ADD_OWNER_ROLE_SUCCESS, {
          ...data,
          isCurrentUserRoleChanging: true
        });
    }
  });
};

const removeMemberRoleInList = (socket, clients) => {
  socket.on(ListActionTypes.REMOVE_MEMBER_ROLE_SUCCESS, data => {
    const { listId, userId } = data;

    socket.broadcast
      .to(`sack-${listId}`)
      .emit(ListActionTypes.REMOVE_MEMBER_ROLE_SUCCESS, {
        ...data,
        isCurrentUserRoleChanging: false
      });

    if (clients.has(userId)) {
      socket.broadcast
        .to(clients.get(userId))
        .emit(ListActionTypes.REMOVE_MEMBER_ROLE_SUCCESS, {
          ...data,
          isCurrentUserRoleChanging: true
        });
    }
  });
};

const removeOwnerRoleInList = (socket, clients) => {
  socket.on(ListActionTypes.REMOVE_OWNER_ROLE_SUCCESS, data => {
    const { listId, userId } = data;

    socket.broadcast
      .to(`sack-${listId}`)
      .emit(ListActionTypes.REMOVE_OWNER_ROLE_SUCCESS, {
        ...data,
        isCurrentUserRoleChanging: false
      });

    if (clients.has(userId)) {
      socket.broadcast
        .to(clients.get(userId))
        .emit(ListActionTypes.REMOVE_OWNER_ROLE_SUCCESS, {
          ...data,
          isCurrentUserRoleChanging: true
        });
    }
  });
};

const leaveList = socket =>
  socket.on(ListActionTypes.LEAVE_SUCCESS, data => {
    const { listId } = data;

    socket.broadcast
      .to(`sack-${listId}`)
      .emit(ListActionTypes.REMOVE_MEMBER_SUCCESS, data);
  });

const emitRemoveMemberOnLeaveCohort = socket =>
  socket.on(CohortActionTypes.LEAVE_SUCCESS, data => {
    const { cohortId, userId } = data;

    List.find(
      {
        cohortId,
        type: ListType.SHARED
      },
      '_id created_at cohortId name description items favIds type'
    )
      .lean()
      .exec()
      .then(docs => {
        if (docs) {
          const sharedListIds = docs.map(list => list._id.toString());

          sharedListIds.forEach(listId =>
            socket.broadcast
              .to(`sack-${listId}`)
              .emit(ListActionTypes.REMOVE_MEMBER_SUCCESS, { listId, userId })
          );
        }
      });
  });

module.exports = {
  addComment,
  addItemToList,
  addListMember,
  addMemberRoleInList,
  addOwnerRoleInList,
  archiveItem,
  changeOrderState,
  clearVote,
  cloneItem,
  deleteItem,
  emitListsOnAddCohortMember,
  emitRemoveMemberOnLeaveCohort,
  leaveList,
  removeMemberRoleInList,
  removeOwnerRoleInList,
  restoreItem,
  setVote,
  updateItem,
  updateItemState
};
