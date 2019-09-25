const _keyBy = require('lodash/keyBy');

const { ListType, LOCK_TIMEOUT } = require('../common/variables');
const {
  AppEvents,
  CommentActionTypes,
  ItemActionTypes,
  ItemStatusType,
  ListActionTypes,
  ListHeaderStatusTypes
} = require('./eventTypes');
const List = require('../models/list.model');
const {
  checkIfArrayContainsUserId,
  countItems,
  isMember,
  responseWithList
} = require('../common/utils');
const {
  descriptionLockId,
  getUserSockets,
  handleItemLocks,
  handleLocks,
  listChannel,
  listMetaDataChannel,
  nameLockId,
  sendListOnDashboardAndCohortView
} = require('./helpers');
const { isDefined } = require('../common/utils/helpers');
const {
  delayedUnlock,
  emitItemPerUser,
  emitItemUpdate,
  emitVoteChange
} = require('./helpers');

const addItemToList = io => data =>
  emitItemUpdate(io)(ItemActionTypes.ADD_SUCCESS)(data);

const deleteItem = io => data =>
  emitItemUpdate(io)(ItemActionTypes.DELETE_SUCCESS)(data);

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

    if (isDefined(nameLock) && isDefined(descriptionLock)) {
      const locks = { name: false, description: false };

      delayedUnlock(socket)(data)(itemClientLocks)(locks);
      itemClientLocks.set(nameLockId(itemId), delayedUnlock);

      return;
    }

    if (isDefined(nameLock)) {
      const locks = { description: descriptionLock, name: false };

      delayedUnlock(socket)(data)(itemClientLocks)(locks);
      itemClientLocks.set(nameLockId(itemId), delayedUnlock);
    }

    if (isDefined(descriptionLock)) {
      const locks = { description: false, name: nameLock };

      delayedUnlock(socket)(data)(itemClientLocks)(locks);
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

const markAsDone = io => data =>
  emitItemUpdate(io)(ItemActionTypes.MARK_AS_DONE_SUCCESS)(data);

const markAsUnhandled = io => data =>
  emitItemUpdate(io)(ItemActionTypes.MARK_AS_UNHANDLED_SUCCESS)(data);

const archiveItem = io => data =>
  emitItemUpdate(io)(ItemActionTypes.ARCHIVE_SUCCESS)(data);

const restoreItem = io => async data => {
  const {
    item,
    itemId,
    list: { items, viewersIds },
    listId
  } = data;

  io.sockets
    .to(listMetaDataChannel(listId))
    .emit(ListActionTypes.UPDATE_SUCCESS, { listId, ...countItems(items) });

  await emitItemPerUser(io)(ItemActionTypes.RESTORE_SUCCESS)(viewersIds, {
    item,
    itemId,
    listId
  });

  return Promise.resolve();
};

const updateItem = io => data => {
  emitItemUpdate(io)(ItemActionTypes.UPDATE_SUCCESS)(data);
};

const addComment = io => data => {
  const { listId } = data;

  io.sockets.to(listChannel(listId)).emit(CommentActionTypes.ADD_SUCCESS, data);
};

const cloneItem = io => data =>
  emitItemUpdate(io)(ItemActionTypes.CLONE_SUCCESS)(data);

const addViewer = io => async data => {
  const {
    list,
    list: { _id: listId },
    userToSend,
    userToSend: { _id: viewerId }
  } = data;

  io.sockets.to(listChannel(listId)).emit(ListActionTypes.ADD_VIEWER_SUCCESS, {
    listId,
    viewer: { ...userToSend }
  });

  try {
    const socketIds = await getUserSockets(viewerId);

    socketIds.forEach(socketId =>
      io.sockets
        .to(socketId)
        .emit(AppEvents.JOIN_ROOM, listMetaDataChannel(listId))
    );

    socketIds.forEach(socketId =>
      io.sockets.to(socketId).emit(ListActionTypes.FETCH_META_DATA_SUCCESS, {
        [listId]: responseWithList(list, viewerId)
      })
    );
  } catch {
    // Ignore error
  }

  return Promise.resolve();
};

const setVote = io => async data => {
  const { sessionId, viewersIds, ...rest } = data;

  try {
    await emitVoteChange(io)(ItemActionTypes.SET_VOTE_SUCCESS)(
      viewersIds,
      { ...rest, isVoted: true },
      sessionId
    );
  } catch {
    // Ignore error
  }

  return Promise.resolve();
};

const clearVote = io => async data => {
  const { sessionId, viewersIds, ...rest } = data;

  try {
    await emitVoteChange(io)(ItemActionTypes.CLEAR_VOTE_SUCCESS)(
      viewersIds,
      { ...rest, isVoted: false },
      sessionId
    );
  } catch {
    // Ignore error
  }

  return Promise.resolve();
};

const updateList = (io, dashboardViewClients, cohortViewClients) => data => {
  const { listId, doc: list, ...rest } = data;

  io.sockets
    .to(listChannel(listId))
    .emit(ListActionTypes.UPDATE_SUCCESS, { listId, ...rest });

  sendListOnDashboardAndCohortView(io)(cohortViewClients, dashboardViewClients)(
    list
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

const addMemberRoleInList = io => async data => {
  const { listId, userId } = data;

  io.sockets
    .to(listChannel(listId))
    .emit(ListActionTypes.ADD_MEMBER_ROLE_SUCCESS, {
      ...data,
      isCurrentUserRoleChanging: false
    });

  try {
    const socketIds = await getUserSockets(userId);

    socketIds.forEach(socketId =>
      io.sockets.to(socketId).emit(ListActionTypes.ADD_MEMBER_ROLE_SUCCESS, {
        ...data,
        isCurrentUserRoleChanging: true
      })
    );
  } catch {
    // Ignore errors
  }

  return Promise.resolve();
};

const addOwnerRoleInList = io => async data => {
  const { listId, userId } = data;

  io.sockets
    .to(listChannel(listId))
    .emit(ListActionTypes.ADD_OWNER_ROLE_SUCCESS, {
      ...data,
      isCurrentUserRoleChanging: false
    });

  try {
    const socketIds = await getUserSockets(userId);

    socketIds.forEach(socketId =>
      io.sockets.to(socketId).emit(ListActionTypes.ADD_OWNER_ROLE_SUCCESS, {
        ...data,
        isCurrentUserRoleChanging: true
      })
    );
  } catch {
    // Ignore errors
  }

  return Promise.resolve();
};

const removeMemberRoleInList = io => async data => {
  const { listId, userId } = data;

  io.sockets
    .to(listChannel(listId))
    .emit(ListActionTypes.REMOVE_MEMBER_ROLE_SUCCESS, {
      ...data,
      isCurrentUserRoleChanging: false
    });

  try {
    const socketIds = await getUserSockets(userId);

    socketIds.forEach(socketId =>
      io.sockets.to(socketId).emit(ListActionTypes.REMOVE_MEMBER_ROLE_SUCCESS, {
        ...data,
        isCurrentUserRoleChanging: true
      })
    );
  } catch {
    // Ignore errors
  }

  return Promise.resolve();
};

const removeOwnerRoleInList = io => async data => {
  const { listId, userId } = data;

  io.sockets
    .to(listChannel(listId))
    .emit(ListActionTypes.REMOVE_OWNER_ROLE_SUCCESS, {
      ...data,
      isCurrentUserRoleChanging: false
    });

  try {
    const socketIds = await getUserSockets(userId);

    socketIds.forEach(socketId =>
      io.sockets.to(socketId).emit(ListActionTypes.REMOVE_OWNER_ROLE_SUCCESS, {
        ...data,
        isCurrentUserRoleChanging: true
      })
    );
  } catch {
    // Ignore errors
  }

  return Promise.resolve();
};

const leaveList = io => async data => {
  const { listId, userId } = data;

  io.sockets
    .to(listChannel(listId))
    .emit(ListActionTypes.REMOVE_MEMBER_SUCCESS, data);

  try {
    const socketIds = await getUserSockets(userId);

    socketIds.forEach(socketId =>
      io.sockets
        .to(socketId)
        .emit(AppEvents.LEAVE_ROOM, listMetaDataChannel(listId))
    );

    socketIds.forEach(socketId =>
      io.sockets.to(socketId).emit(ListActionTypes.DELETE_SUCCESS, data)
    );
  } catch {
    // Ignore error
  }

  return Promise.resolve();
};

const changeListType = (
  io,
  dashboardClients,
  cohortClients,
  listClients
) => data => {
  const { listId, members, type, removedViewers } = data;

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
          .emit(ListActionTypes.CHANGE_TYPE_SUCCESS, {
            listId,
            members: _keyBy(members, '_id'),
            type
          });

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

const removeViewer = io => async data => {
  const { listId, userId } = data;

  io.sockets
    .to(listChannel(listId))
    .emit(ListActionTypes.REMOVE_MEMBER_SUCCESS, data);

  try {
    const socketIds = await getUserSockets(userId);

    socketIds.forEach(socketId =>
      io.sockets
        .to(socketId)
        .emit(AppEvents.LEAVE_ROOM, listMetaDataChannel(listId))
    );

    socketIds.forEach(socketId =>
      io.sockets.to(socketId).emit(ListActionTypes.DELETE_SUCCESS, data)
    );
  } catch {
    // Ignore error
  }

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
    .to(listChannel(listId))
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

const moveToList = io => async data => {
  const { movedItem, sourceItemId, sourceList, targetList } = data;
  const { _id: sourceListId, items: sourceListItems } = sourceList;
  const { _id: targetListId, items: targetListItems, viewersIds } = targetList;

  io.sockets
    .to(listMetaDataChannel(sourceListId))
    .emit(ListActionTypes.UPDATE_SUCCESS, {
      listId: sourceListId,
      ...countItems(sourceListItems)
    });

  io.sockets
    .to(listMetaDataChannel(targetListId))
    .emit(ListActionTypes.UPDATE_SUCCESS, {
      listId: targetListId,
      ...countItems(targetListItems)
    });

  io.sockets
    .to(listChannel(sourceListId))
    .emit(ItemActionTypes.DELETE_SUCCESS, {
      itemId: sourceItemId,
      listId: sourceListId
    });

  await emitItemPerUser(io)(ItemActionTypes.ADD_SUCCESS)(viewersIds, {
    item: movedItem,
    listId: targetListId
  });

  return Promise.resolve();
};

module.exports = {
  addComment,
  addItemToList,
  addViewer,
  addMemberRoleInList,
  addOwnerRoleInList,
  archiveItem,
  archiveList,
  changeListType,
  clearVote,
  cloneItem,
  deleteItem,
  deleteList,
  leaveList,
  markAsDone,
  markAsUnhandled,
  moveToList,
  removeMemberRoleInList,
  removeOwnerRoleInList,
  removeViewer,
  restoreItem,
  restoreList,
  setVote,
  updateItem,
  updateItemState,
  updateList,
  updateListHeaderState
};
