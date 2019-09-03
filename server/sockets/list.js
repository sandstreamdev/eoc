const {
  CommentActionTypes,
  ItemActionTypes,
  ItemStatusType,
  ListActionTypes,
  ListHeaderStatusTypes,
  ListType,
  LOCK_TIMEOUT,
  NotificationEvents
} = require('../common/variables');
const List = require('../models/list.model');
const {
  checkIfArrayContainsUserId,
  isMember,
  responseWithItem,
  responseWithList
} = require('../common/utils');
const {
  descriptionLockId,
  handleItemLocks,
  handleLocks,
  listChannel,
  nameLockId,
  updateListOnDashboardAndCohortView
} = require('./helpers');
const { isDefined } = require('../common/utils/helpers');
const { votingBroadcast } = require('./helpers');

const addItemToList = (io, cohortClients, dashboardClients) => data => {
  const { listId } = data;

  io.sockets.to(listChannel(listId)).emit(ItemActionTypes.ADD_SUCCESS, data);

  return updateListOnDashboardAndCohortView(
    io,
    listId,
    dashboardClients,
    cohortClients
  );
};

const deleteItem = io => data => {
  const { listId } = data;

  io.sockets.to(listChannel(listId)).emit(ItemActionTypes.DELETE_SUCCESS, data);

  return Promise.resolve();
};

const updateItemState = (socket, itemClientLocks) => {
  socket.on(ItemStatusType.LOCK, data => {
    const { descriptionLock, itemId, listId, nameLock, userId } = data;
    const locks = { description: descriptionLock, name: nameLock };

    handleItemLocks(
      List,
      { _id: listId, 'items._id': itemId, memberIds: userId },
      itemId
    )(locks).then(() => {
      socket.broadcast
        .to(listChannel(listId))
        .emit(ItemStatusType.LOCK, { itemId, listId, locks });
    });

    if (isDefined(nameLock)) {
      const delayedUnlock = setTimeout(() => {
        locks.name = false;

        handleItemLocks(
          List,
          {
            _id: listId,
            'items._id': itemId,
            memberIds: userId
          },
          itemId
        )(locks).then(() => {
          socket.broadcast
            .to(listChannel(listId))
            .emit(ItemStatusType.UNLOCK, { itemId, listId, locks });

          clearTimeout(itemClientLocks.get(nameLockId(itemId)));
          itemClientLocks.delete(nameLockId(itemId));
        });
      }, LOCK_TIMEOUT);

      itemClientLocks.set(nameLockId(itemId), delayedUnlock);
    }

    if (isDefined(descriptionLock)) {
      const delayedUnlock = setTimeout(() => {
        locks.description = false;

        handleItemLocks(
          List,
          {
            _id: listId,
            'items._id': itemId,
            memberIds: userId
          },
          { itemId }
        )(locks).then(() => {
          socket.broadcast
            .to(listChannel(listId))
            .emit(ItemStatusType.UNLOCK, { itemId, listId, locks });

          clearTimeout(itemClientLocks.get(descriptionLockId(itemId)));
          itemClientLocks.delete(descriptionLockId(itemId));
        });
      }, LOCK_TIMEOUT);

      itemClientLocks.set(nameLockId(itemId), delayedUnlock);
    }
  });

  socket.on(ItemStatusType.UNLOCK, data => {
    const { descriptionLock, itemId, listId, nameLock, userId } = data;
    const locks = { description: descriptionLock, name: nameLock };

    handleItemLocks(
      List,
      { _id: listId, 'items._id': itemId, memberIds: userId },
      itemId
    )(locks).then(() => {
      socket.broadcast
        .to(listChannel(listId))
        .emit(ItemStatusType.UNLOCK, { itemId, listId, locks });
    });

    if (itemClientLocks.has(nameLockId(itemId))) {
      clearTimeout(itemClientLocks.get(nameLockId(itemId)));
      itemClientLocks.delete(nameLockId(itemId));
    }

    if (itemClientLocks.has(descriptionLockId(itemId))) {
      clearTimeout(itemClientLocks.get(descriptionLockId(itemId)));
      itemClientLocks.delete(descriptionLockId(itemId));
    }
  });
};

const updateItem = (
  io,
  cohortClients,
  dashboardClients,
  listClients
) => data => {
  const { itemId, listId, userId } = data;

  return List.findById(listId)
    .lean()
    .populate('items.authorId', 'displayName')
    .populate('items.editedBy', 'displayName')
    .exec()
    .then(doc => {
      if (doc) {
        const { items, viewersIds } = doc;
        const itemIndex = items.findIndex(
          item => item._id.toString() === itemId
        );
        const item = items[itemIndex];

        viewersIds.forEach(id => {
          const viewerId = id.toString();

          if (viewerId !== userId.toString()) {
            if (listClients.has(viewerId)) {
              const { socketId } = listClients.get(viewerId);

              io.sockets.to(socketId).emit(ItemActionTypes.UPDATE_SUCCESS, {
                listId,
                item: responseWithItem(item, viewerId)
              });
            }
          }
        });

        return updateListOnDashboardAndCohortView(
          io,
          listId,
          dashboardClients,
          cohortClients
        );
      }
    });
};

const addComment = io => data => {
  const { listId } = data;

  io.sockets.to(listChannel(listId)).emit(CommentActionTypes.ADD_SUCCESS, data);

  return Promise.resolve();
};

const cloneItem = (
  io,
  cohortClients,
  dashboardClients,
  listClients,
  viewersIds
) => data => {
  const { item, listId, userId } = data;
  const dataToSend = { item, listId };

  viewersIds.forEach(viewerId => {
    const viewerIdAsString = viewerId.toString();

    if (viewerIdAsString !== userId.toString()) {
      if (listClients.has(viewerIdAsString)) {
        const { socketId, viewId } = listClients.get(viewerIdAsString);

        if (viewId === listId) {
          io.sockets
            .to(socketId)
            .emit(ItemActionTypes.CLONE_SUCCESS, dataToSend);
        }
      }
    }
  });

  return updateListOnDashboardAndCohortView(
    io,
    listId,
    dashboardClients,
    cohortClients
  );
};

const addListViewer = (
  io,
  dashboardClients,
  cohortClients,
  onlineClients
) => data => {
  const {
    listId,
    notificationData,
    userToSend,
    userToSend: { _id: viewerId, _id }
  } = data;

  if (onlineClients.has(viewerId.toString())) {
    const { socketId } = onlineClients.get(viewerId.toString());

    io.sockets
      .to(socketId)
      .emit(NotificationEvents.ADD_LIST_VIEWER, notificationData);
  }

  io.sockets
    .to(listChannel(listId))
    .emit(ListActionTypes.ADD_VIEWER_SUCCESS, { ...userToSend, _id });

  return List.findById(listId)
    .lean()
    .exec()
    .then(doc => {
      if (doc) {
        const { cohortId } = doc;
        const list = responseWithList(doc, viewerId);

        if (cohortId && cohortClients.has(viewerId.toString())) {
          const { viewId, socketId } = cohortClients.get(viewerId.toString());

          if (viewId === cohortId.toString()) {
            io.sockets
              .to(socketId)
              .emit(ListActionTypes.FETCH_META_DATA_SUCCESS, {
                [listId]: list
              });
          }
        }

        if (dashboardClients.has(viewerId.toString())) {
          const { socketId } = dashboardClients.get(viewerId.toString());

          io.sockets
            .to(socketId)
            .emit(ListActionTypes.FETCH_META_DATA_SUCCESS, {
              [listId]: list
            });
        }
      }
    });
};

const setVote = (io, listClients, viewersIds) => data => {
  const { listId, itemId } = data;
  const action = ItemActionTypes.SET_VOTE_SUCCESS;
  const payload = { listId, itemId };

  return votingBroadcast(io)(data)(listClients)(viewersIds)(action, payload);
};

const clearVote = (io, listClients, viewersIds) => data => {
  const { listId, itemId } = data;
  const action = ItemActionTypes.CLEAR_VOTE_SUCCESS;
  const payload = { listId, itemId };

  return votingBroadcast(io)(data)(listClients)(viewersIds)(action, payload);
};

const updateList = (io, dashboardViewClients, cohortViewClients) => data => {
  const { listId } = data;

  io.sockets.to(listChannel(listId)).emit(ListActionTypes.UPDATE_SUCCESS, data);

  updateListOnDashboardAndCohortView(
    io.sockets,
    listId,
    dashboardViewClients,
    cohortViewClients
  );
};

const updateListHeaderState = (socket, listClientLocks) => {
  socket.on(ListHeaderStatusTypes.UNLOCK, data => {
    const { descriptionLock, listId, nameLock, userId } = data;
    const locks = { description: descriptionLock, name: nameLock };

    handleLocks(List, { _id: listId, ownerIds: userId })(locks).then(() => {
      socket.broadcast
        .to(listChannel(listId))
        .emit(ListHeaderStatusTypes.UNLOCK, { listId, locks });

      const lock = isDefined(nameLock) ? nameLockId : descriptionLockId;

      if (listClientLocks.has(lock(listId))) {
        clearTimeout(listClientLocks.get(lock(listId)));
        listClientLocks.delete(lock(listId));
      }
    });
  });

  socket.on(ListHeaderStatusTypes.LOCK, data => {
    const { descriptionLock, listId, nameLock, userId } = data;
    const locks = { description: descriptionLock, name: nameLock };

    handleLocks(List, { _id: listId, ownerIds: userId })(locks).then(() => {
      socket.broadcast
        .to(listChannel(listId))
        .emit(ListHeaderStatusTypes.LOCK, { listId, locks });

      const lock = isDefined(nameLock) ? nameLockId : descriptionLockId;
      const delayedUnlock = setTimeout(() => {
        if (isDefined(nameLock)) {
          locks.name = false;
        }

        if (isDefined(descriptionLock)) {
          locks.description = false;
        }

        handleLocks(List, { _id: listId, ownerIds: userId })(locks).then(() => {
          socket.broadcast
            .to(listChannel(listId))
            .emit(ListHeaderStatusTypes.UNLOCK, { listId, locks });

          clearTimeout(listClientLocks.get(lock(listId)));
          listClientLocks.delete(lock(listId));
        });
      }, LOCK_TIMEOUT);

      listClientLocks.set(lock(listId), delayedUnlock);
    });
  });
};

const addMemberRoleInList = (io, clients) => data => {
  const { listId, userId } = data;

  io.sockets
    .to(listChannel(listId))
    .emit(ListActionTypes.ADD_MEMBER_ROLE_SUCCESS, {
      ...data,
      isCurrentUserRoleChanging: false
    });

  if (clients.has(userId)) {
    const { viewId, socketId } = clients.get(userId);

    if (viewId === listId) {
      io.sockets.to(socketId).emit(ListActionTypes.ADD_MEMBER_ROLE_SUCCESS, {
        ...data,
        isCurrentUserRoleChanging: true
      });
    }
  }

  return Promise.resolve();
};

const addOwnerRoleInList = (io, clients) => data => {
  const { listId, userId } = data;

  io.sockets
    .to(listChannel(listId))
    .emit(ListActionTypes.ADD_OWNER_ROLE_SUCCESS, {
      ...data,
      isCurrentUserRoleChanging: false
    });

  if (clients.has(userId)) {
    const { viewId, socketId } = clients.get(userId);

    if (viewId === listId) {
      io.sockets.to(socketId).emit(ListActionTypes.ADD_OWNER_ROLE_SUCCESS, {
        ...data,
        isCurrentUserRoleChanging: true
      });
    }
  }

  return Promise.resolve();
};

const removeMemberRoleInList = (io, clients) => data => {
  const { listId, userId } = data;

  io.sockets
    .to(listChannel(listId))
    .emit(ListActionTypes.REMOVE_MEMBER_ROLE_SUCCESS, {
      ...data,
      isCurrentUserRoleChanging: false
    });

  if (clients.has(userId)) {
    const { viewId, socketId } = clients.get(userId);

    if (viewId === listId) {
      io.sockets.to(socketId).emit(ListActionTypes.REMOVE_MEMBER_ROLE_SUCCESS, {
        ...data,
        isCurrentUserRoleChanging: true
      });
    }
  }

  return Promise.resolve();
};

const removeOwnerRoleInList = (io, clients) => data => {
  const { listId, userId } = data;

  io.sockets
    .to(listChannel(listId))
    .emit(ListActionTypes.REMOVE_OWNER_ROLE_SUCCESS, {
      ...data,
      isCurrentUserRoleChanging: false
    });

  if (clients.has(userId)) {
    const { viewId, socketId } = clients.get(userId);

    if (viewId === listId) {
      io.sockets.to(socketId).emit(ListActionTypes.REMOVE_OWNER_ROLE_SUCCESS, {
        ...data,
        isCurrentUserRoleChanging: true
      });
    }
  }
};

const leaveList = io => data => {
  const { listId } = data;

  io.sockets
    .to(listChannel(listId))
    .emit(ListActionTypes.REMOVE_MEMBER_SUCCESS, data);

  return Promise.resolve();
};

const changeListType = (
  io,
  dashboardClients,
  cohortClients,
  listClients
) => data => {
  const { listId, type, removedViewers } = data;

  return List.findById(listId)
    .populate('cohortId', 'memberIds')
    .lean()
    .exec()
    .then(doc => {
      if (doc) {
        const {
          cohortId: { _id: cohortId, memberIds: cohortMemberIds },
          viewersIds
        } = doc;

        const list = { ...doc, cohortId };

        io.sockets
          .to(listChannel(listId))
          .emit(ListActionTypes.CHANGE_TYPE_SUCCESS, data);

        if (type === ListType.LIMITED) {
          removedViewers.forEach(id => {
            const userId = id.toString();
            const isCohortMember = checkIfArrayContainsUserId(
              cohortMemberIds,
              userId
            );

            if (listClients.has(userId)) {
              const { viewId, socketId } = listClients.get(userId);

              if (viewId === listId) {
                io.sockets
                  .to(socketId)
                  .emit(ListActionTypes.LEAVE_ON_TYPE_CHANGE_SUCCESS, {
                    cohortId,
                    isCohortMember,
                    listId,
                    type
                  });
              }
            }

            if (dashboardClients.has(userId)) {
              const { socketId } = dashboardClients.get(userId);

              io.sockets
                .to(socketId)
                .emit(ListActionTypes.DELETE_SUCCESS, { listId });
            }

            if (cohortClients.has(userId)) {
              const { viewId, socketId } = cohortClients.get(userId);

              if (viewId === cohortId.toString()) {
                io.sockets
                  .to(socketId)
                  .emit(ListActionTypes.DELETE_SUCCESS, { listId });
              }
            }
          });
        }

        viewersIds.forEach(id => {
          const userId = id.toString();

          if (dashboardClients.has(userId)) {
            const { socketId } = dashboardClients.get(userId);

            io.sockets
              .to(socketId)
              .emit(ListActionTypes.FETCH_META_DATA_SUCCESS, {
                [list._id]: responseWithList(list, userId)
              });
          }

          if (cohortClients.has(userId)) {
            const { viewId, socketId } = cohortClients.get(userId);

            if (viewId === cohortId.toString()) {
              io.sockets
                .to(socketId)
                .emit(ListActionTypes.FETCH_META_DATA_SUCCESS, {
                  [list._id]: responseWithList(list, userId)
                });
            }
          }
        });
      }
    });
};

const removeListMember = (
  io,
  dashboardClients,
  listClients,
  cohortClients
) => data => {
  const { cohortId, listId, userId } = data;

  if (dashboardClients.has(userId)) {
    const { socketId, viewId } = dashboardClients.get(userId);

    if (viewId === listId) {
      io.sockets.to(socketId).emit(ListActionTypes.DELETE_SUCCESS, { listId });
    }
  }

  if (listClients.has(userId)) {
    List.findById(listId)
      .populate('cohortId')
      .lean()
      .exec()
      .then(doc => {
        if (doc) {
          const { socketId, viewId } = listClients.get(userId);
          const { cohortId: cohort } = doc;
          const data = { listId };

          if (viewId === listId) {
            if (cohort) {
              const { _id: cohortId } = cohort;
              data.isCohortMember = isMember(cohort, userId);
              data.cohortId = cohortId;
            }

            io.sockets
              .to(socketId)
              .emit(ListActionTypes.REMOVED_BY_SOMEONE, data);
          }
        }
      });
  }

  if (cohortClients.has(userId)) {
    const { socketId, viewId } = cohortClients.get(userId);

    if (viewId === cohortId.toString()) {
      io.sockets.to(socketId).emit(ListActionTypes.DELETE_SUCCESS, { listId });
    }
  }

  io.sockets
    .to(`sack-${listId}`)
    .emit(ListActionTypes.REMOVE_MEMBER_SUCCESS, { listId, userId });

  return Promise.resolve();
};

const archiveList = (
  io,
  dashboardClients,
  cohortClients,
  listClients
) => data => {
  const { listId, cohortId } = data;

  List.findById(listId)
    .populate('cohortId')
    .lean()
    .exec()
    .then(doc => {
      const { cohortId: cohort, memberIds, viewersIds } = doc;
      const list = { ...doc, cohortId };

      viewersIds.forEach(viewerId => {
        const id = viewerId.toString();
        let isCohortMember = false;

        if (cohort) {
          isCohortMember = isMember(cohort, viewerId);
        }

        const dataToSend = { isCohortMember, ...data };

        if (listClients.has(id)) {
          const { socketId, viewId } = listClients.get(id);

          if (viewId === listId) {
            io.sockets
              .to(socketId)
              .emit(ListActionTypes.ARCHIVE_SUCCESS, dataToSend);
          }
        }

        if (dashboardClients.has(id)) {
          const { socketId } = dashboardClients.get(id);

          // Broadcast to clients on dashboard that have this list
          io.sockets
            .to(socketId)
            .emit(ListActionTypes.DELETE_SUCCESS, { listId });
        }

        if (cohortClients.has(id)) {
          const { socketId, viewId } = cohortClients.get(id);
          if (viewId === cohortId.toString()) {
            // Broadcast to clients on cohort view that have this list
            io.sockets
              .to(socketId)
              .emit(ListActionTypes.DELETE_SUCCESS, { listId });
          }
        }
      });

      memberIds.forEach(memberId => {
        const id = memberId.toString();

        if (dashboardClients.has(id)) {
          const { socketId } = dashboardClients.get(id);

          // Broadcast to clients on dashboard that have this list
          io.sockets
            .to(socketId)
            .emit(ListActionTypes.FETCH_ARCHIVED_META_DATA_SUCCESS, {
              [listId]: {
                ...responseWithList(list, memberId),
                isArchived: true
              }
            });
        }
        if (cohortClients.has(id)) {
          const { socketId, viewId } = cohortClients.get(id);

          if (viewId === cohortId.toString()) {
            // Broadcast to clients on cohort view that have this list
            io.sockets
              .to(socketId)
              .emit(ListActionTypes.FETCH_ARCHIVED_META_DATA_SUCCESS, {
                [listId]: {
                  ...responseWithList(list, memberId),
                  isArchived: true
                }
              });
          }
        }
      });
    });
};

const deleteList = (io, dashboardClients, cohortClients) => data => {
  const { listId, cohortId } = data;

  io.sockets
    .to(`sack-${listId}`)
    .emit(ListActionTypes.DELETE_AND_REDIRECT, data);

  dashboardClients.forEach(({ socketId }) =>
    io.sockets.to(socketId).emit(ListActionTypes.DELETE_SUCCESS, { listId })
  );

  if (cohortId) {
    cohortClients.forEach(client => {
      const { socketId, viewId } = client;

      if (viewId === cohortId.toString()) {
        io.sockets
          .to(socketId)
          .emit(ListActionTypes.DELETE_SUCCESS, { listId });
      }
    });
  }
};

const restoreList = (
  io,
  dashboardClients,
  cohortClients,
  listClients
) => listData => {
  const { listId, cohortId } = listData;

  List.findById(listId)
    .lean()
    .exec()
    .then(doc => {
      const { viewersIds, memberIds } = doc;

      viewersIds.forEach(viewerId => {
        const id = viewerId.toString();

        if (dashboardClients.has(id)) {
          const { socketId } = dashboardClients.get(id);

          io.sockets
            .to(socketId)
            .emit(ListActionTypes.FETCH_META_DATA_SUCCESS, {
              [listId]: responseWithList(doc, id)
            });
        }

        if (cohortClients.has(id)) {
          const { socketId, viewId } = cohortClients.get(id);

          if (viewId === cohortId.toString()) {
            io.sockets
              .to(socketId)
              .emit(ListActionTypes.FETCH_META_DATA_SUCCESS, {
                [listId]: responseWithList(doc, id)
              });
          }
        }
      });

      memberIds.forEach(memberId => {
        const id = memberId.toString();

        if (listClients.has(id)) {
          const { socketId, viewId } = listClients.get(id);

          if (viewId === listId) {
            io.sockets.to(socketId).emit(ListActionTypes.RESTORE_SUCCESS, {
              data: responseWithList(doc, id),
              listId
            });
          }
        }
      });
    });
};

module.exports = {
  addComment,
  addItemToList,
  addListViewer,
  addMemberRoleInList,
  addOwnerRoleInList,
  archiveList,
  changeListType,
  clearVote,
  cloneItem,
  deleteItem,
  deleteList,
  leaveList,
  removeListMember,
  removeMemberRoleInList,
  removeOwnerRoleInList,
  restoreList,
  setVote,
  updateItem,
  updateItemState,
  updateList,
  updateListHeaderState
};
