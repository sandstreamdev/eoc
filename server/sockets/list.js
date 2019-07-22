const _keyBy = require('lodash/keyBy');

const {
  CohortActionTypes,
  CommentActionTypes,
  ItemActionTypes,
  ItemStatusType,
  ListActionTypes,
  ListHeaderStatusTypes,
  ListType
} = require('../common/variables');
const List = require('../models/list.model');
const {
  checkIfArrayContainsUserId,
  responseWithList,
  responseWithListsMetaData
} = require('../common/utils');
const {
  emitForMany,
  emitListForMany,
  updateListOnDashboardAndCohortView
} = require('./helpers');

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

const changeItemOrderState = (
  socket,
  dashboardViewClients,
  cohortViewClients
) => {
  socket.on(ItemActionTypes.TOGGLE_SUCCESS, data => {
    const { listId } = data;

    // send to users that are on the list view
    socket.broadcast
      .to(`sack-${data.listId}`)
      .emit(ItemActionTypes.TOGGLE_SUCCESS, data);

    // send to users on dashboard and cohort view
    updateListOnDashboardAndCohortView(
      socket,
      listId,
      dashboardViewClients,
      cohortViewClients
    );
  });
};

const updateList = (socket, dashboardViewClients, cohortViewClients) => {
  socket.on(ListActionTypes.UPDATE_SUCCESS, data => {
    const { listId } = data;

    // send to users that are on the list view
    socket.broadcast
      .to(`sack-${listId}`)
      .emit(ListActionTypes.UPDATE_SUCCESS, data);

    // send to users on dashboard and cohort view
    updateListOnDashboardAndCohortView(
      socket,
      listId,
      dashboardViewClients,
      cohortViewClients
    );
  });
};

const updateListHeaderState = socket => {
  socket.on(ListHeaderStatusTypes.UNLOCK, data => {
    const { listId } = data;

    socket.broadcast
      .to(`sack-${listId}`)
      .emit(ListHeaderStatusTypes.UNLOCK, data);
  });

  socket.on(ListHeaderStatusTypes.LOCK, data => {
    const { listId } = data;

    socket.broadcast
      .to(`sack-${listId}`)
      .emit(ListHeaderStatusTypes.LOCK, data);
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

const changeListType = (socket, dashboardClients, cohortClients, listClients) =>
  socket.on(ListActionTypes.CHANGE_TYPE_SUCCESS, data => {
    const { listId, type, removedViewers } = data;

    List.findById(listId)
      .populate('cohortId', 'memberIds')
      .lean()
      .exec()
      .then(doc => {
        if (doc) {
          const {
            cohortId: { _id: cohortId, memberIds: cohortMemberIds },
            viewersIds
          } = doc;

          if (listClients.size > 0) {
            if (type === ListType.LIMITED && removedViewers) {
              removedViewers.forEach(id => {
                const userId = id.toString();
                const isCohortMember = checkIfArrayContainsUserId(
                  cohortMemberIds,
                  userId
                );

                if (listClients.has(userId)) {
                  socket.broadcast
                    .to(listClients.get(userId))
                    .emit(ListActionTypes.LEAVE_ON_TYPE_CHANGE_SUCCESS, {
                      cohortId,
                      isCohortMember,
                      listId,
                      type
                    });
                }
              });
            }

            socket.broadcast
              .to(`sack-${listId}`)
              .emit(ListActionTypes.CHANGE_TYPE_SUCCESS, data);
          }

          if (dashboardClients.size > 0) {
            if (type === ListType.LIMITED && removedViewers) {
              emitForMany(
                removedViewers,
                dashboardClients,
                socket,
                ListActionTypes.DELETE_SUCCESS,
                listId
              );
            }

            emitListForMany(
              viewersIds,
              dashboardClients,
              socket,
              ListActionTypes.FETCH_META_DATA_SUCCESS,
              doc
            );
          }

          if (cohortClients.size > 0) {
            if (type === ListType.LIMITED && removedViewers) {
              emitForMany(
                removedViewers,
                cohortClients,
                socket,
                ListActionTypes.DELETE_SUCCESS,
                listId
              );
            }

            emitListForMany(
              viewersIds,
              cohortClients,
              socket,
              ListActionTypes.FETCH_META_DATA_SUCCESS,
              doc
            );
          }
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
  changeItemOrderState,
  changeListType,
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
  updateItemState,
  updateList,
  updateListHeaderState
};
