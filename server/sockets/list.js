const sanitize = require('mongo-sanitize');

const {
  CommentActionTypes,
  ItemActionTypes,
  ItemStatusType,
  ListActionTypes,
  ListHeaderStatusTypes,
  ListType,
  LOCK_TIMEOUT
} = require('../common/variables');
const List = require('../models/list.model');
const User = require('../models/user.model');
const {
  checkIfArrayContainsUserId,
  isMember,
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

const addItemToList = socket => {
  socket.on(ItemActionTypes.ADD_SUCCESS, data => {
    const { listId } = data;

    socket.broadcast
      .to(listChannel(listId))
      .emit(ItemActionTypes.ADD_SUCCESS, data);
  });
};

const archiveItem = socket => {
  socket.on(ItemActionTypes.ARCHIVE_SUCCESS, data => {
    const { listId } = data;

    socket.broadcast
      .to(listChannel(listId))
      .emit(ItemActionTypes.ARCHIVE_SUCCESS, data);
  });
};

const deleteItem = socket => {
  socket.on(ItemActionTypes.DELETE_SUCCESS, data => {
    const { listId } = data;

    socket.broadcast
      .to(listChannel(listId))
      .emit(ItemActionTypes.DELETE_SUCCESS, data);
  });
};

const restoreItem = socket => {
  socket.on(ItemActionTypes.RESTORE_SUCCESS, data => {
    const { listId } = data;

    socket.broadcast
      .to(listChannel(listId))
      .emit(ItemActionTypes.RESTORE_SUCCESS, data);
  });
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

const updateItem = socket => {
  socket.on(ItemActionTypes.UPDATE_SUCCESS, data => {
    const { listId, userId } = data;
    const sanitizedUserId = sanitize(userId);

    User.findById(sanitizedUserId).then(user => {
      if (user) {
        const { displayName } = user;
        const editedBy = displayName;
        const { userId, ...rest } = data;
        const dataToSend = { ...rest, editedBy };

        socket.broadcast
          .to(listChannel(listId))
          .emit(ItemActionTypes.UPDATE_SUCCESS, dataToSend);
      }
    });
  });
};

const addComment = socket =>
  socket.on(CommentActionTypes.ADD_SUCCESS, data => {
    const { listId } = data;

    socket.broadcast
      .to(listChannel(listId))
      .emit(CommentActionTypes.ADD_SUCCESS, data);
  });

const cloneItem = socket =>
  socket.on(ItemActionTypes.CLONE_SUCCESS, data => {
    const { listId } = data;

    socket.broadcast
      .to(listChannel(listId))
      .emit(ItemActionTypes.CLONE_SUCCESS, data);
  });

const addListViewer = (io, dashboardClients, cohortClients) => data => {
  const { listId, _id: viewerId, _id } = data;

  io.sockets
    .to(listChannel(listId))
    .emit(ListActionTypes.ADD_VIEWER_SUCCESS, { ...data, _id });

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

const setVote = socket =>
  socket.on(ItemActionTypes.SET_VOTE_SUCCESS, data => {
    const { listId, itemId } = data;

    socket.broadcast
      .to(listChannel(listId))
      .emit(ItemActionTypes.SET_VOTE_SUCCESS, { listId, itemId });
  });

const clearVote = socket =>
  socket.on(ItemActionTypes.CLEAR_VOTE_SUCCESS, data => {
    const { listId, itemId } = data;

    socket.broadcast
      .to(listChannel(listId))
      .emit(ItemActionTypes.CLEAR_VOTE_SUCCESS, { listId, itemId });
  });

// THIS METHOD NEED TO RECOGNIZE CLIENT SOMEHOW,
// OTHERWISE ITEMS GETS TOGGLED TWICE BY AUTHOR
// const changeItemOrderState = (
//   io,
//   dashboardViewClients,
//   cohortViewClients
// ) => data => {
//   const { listId } = data;
//   console.log(
//     io.clients((err, clients) => {
//       console.log(clients);
//     })
//   );

//   io.sockets.to(listChannel(listId)).emit(ItemActionTypes.TOGGLE_SUCCESS, data);

//   updateListOnDashboardAndCohortView(
//     io.sockets,
//     listId,
//     dashboardViewClients,
//     cohortViewClients
//   );
// };

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
  const { listId, userId } = data;

  if (dashboardClients.has(userId)) {
    const { socketId } = dashboardClients.get(userId);

    io.sockets.to(socketId).emit(ListActionTypes.DELETE_SUCCESS, { listId });
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
    const { socketId } = cohortClients.get(userId);

    io.sockets.to(socketId).emit(ListActionTypes.DELETE_SUCCESS, { listId });
  }

  io.sockets
    .to(`sack-${listId}`)
    .emit(ListActionTypes.REMOVE_MEMBER_SUCCESS, { listId, userId });
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
  archiveItem,
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
  restoreItem,
  restoreList,
  setVote,
  updateItem,
  updateItemState,
  updateList,
  updateListHeaderState
};
