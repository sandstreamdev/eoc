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
  countItems,
  responseWithList,
  responseWithListDetails,
  responseWithListMetaData
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

const changeListType = io => async data => {
  const { list, members, newViewers, removedViewers, type } = data;
  const { _id: listId } = list;

  io.sockets.to(listChannel(listId)).emit(ListActionTypes.CHANGE_TYPE_SUCCESS, {
    listId,
    members: _keyBy(members, '_id'),
    removedViewers,
    type
  });

  io.sockets
    .to(listMetaDataChannel(listId))
    .emit(ListActionTypes.UPDATE_SUCCESS, { listId, type });

  if (type === ListType.LIMITED) {
    removedViewers.forEach(async id => {
      const removedViewerId = id.toString();

      try {
        const socketIds = await getUserSockets(removedViewerId);

        socketIds.forEach(socketId => {
          io.sockets
            .to(socketId)
            .emit(AppEvents.LEAVE_ROOM, listMetaDataChannel(listId));

          io.sockets
            .to(socketId)
            .emit(ListActionTypes.DELETE_SUCCESS, { listId });
        });
      } catch {
        // Ignore errors
      }
    });
  } else {
    newViewers.forEach(async id => {
      const newViewerId = id.toString();
      const listToSend = {
        [listId]: responseWithListMetaData(list, newViewerId)
      };
      try {
        const socketIds = await getUserSockets(newViewerId);

        socketIds.forEach(socketId => {
          io.sockets
            .to(socketId)
            .emit(AppEvents.JOIN_ROOM, listMetaDataChannel(listId));

          io.sockets
            .to(socketId)
            .emit(ListActionTypes.FETCH_META_DATA_SUCCESS, listToSend);
        });
      } catch {
        // Ignore errors
      }
    });
  }

  return Promise.resolve();
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

const archiveList = io => async data => {
  const { listId, cohortId, viewersOnly } = data;

  io.sockets.to(listChannel(listId)).emit(ListActionTypes.ARCHIVE_SUCCESS, {
    cohortId,
    listId,
    redirect: true
  });

  io.sockets
    .to(listMetaDataChannel(listId))
    .emit(ListActionTypes.ARCHIVE_SUCCESS, { cohortId, listId });

  viewersOnly.forEach(async id => {
    const viewerId = id.toString();

    try {
      const socketIds = await getUserSockets(viewerId);

      socketIds.forEach(socketId =>
        io.sockets.to(socketId).emit(ListActionTypes.DELETE_SUCCESS, {
          cohortId,
          listId
        })
      );
    } catch {
      // Ignore errors
    }
  });

  return Promise.resolve();
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

const restoreList = io => async data => {
  const { cohort, list, listId } = data;
  const { viewersIds } = list;

  viewersIds.forEach(async id => {
    const viewerId = id.toString();
    const listToSend = responseWithListDetails(list, viewerId)(cohort);

    try {
      const socketIds = await getUserSockets(viewerId);

      socketIds.forEach(socketId =>
        io.sockets
          .to(socketId)
          .emit(ListActionTypes.RESTORE_SUCCESS, { listId, data: listToSend })
      );
    } catch {
      // Ignore errors
    }
  });

  return Promise.resolve();
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
