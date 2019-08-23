const _keyBy = require('lodash/keyBy');
const sanitize = require('mongo-sanitize');

const {
  CohortActionTypes,
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
  isViewer,
  responseWithList,
  responseWithListsMetaData
} = require('../common/utils');
const {
  getListIdsByViewers,
  getListsDataByViewers,
  handleItemLocks,
  handleLocks,
  listChannel,
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

    socket.broadcast.to(listChannel(listId)).emit(ItemStatusType.LOCK, data);

    const delayedUnlock = setTimeout(() => {
      const updatedData = { ...data };

      if (isDefined(nameLock)) {
        updatedData.nameLock = false;
      }

      if (isDefined(descriptionLock)) {
        updatedData.descriptionLock = false;
      }

      socket.broadcast
        .to(listChannel(listId))
        .emit(ItemStatusType.UNLOCK, updatedData);

      itemClientLocks.delete(userId);
    }, LOCK_TIMEOUT);

    itemClientLocks.set(userId, delayedUnlock);

    const locks = { description: descriptionLock, name: nameLock };

    handleItemLocks(List, { _id: listId, 'items._id': itemId }, itemId)(locks);
  });

  socket.on(ItemStatusType.UNLOCK, data => {
    const { descriptionLock, itemId, listId, nameLock, userId } = data;

    socket.broadcast.to(listChannel(listId)).emit(ItemStatusType.UNLOCK, data);

    if (itemClientLocks.has(userId)) {
      clearTimeout(itemClientLocks.get(userId));
      itemClientLocks.delete(userId);
    }

    const locks = { description: descriptionLock, name: nameLock };

    handleItemLocks(List, { _id: listId, 'items._id': itemId }, itemId)(locks);
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
              .to(listChannel(listId))
              .emit(ListActionTypes.ADD_VIEWER_SUCCESS, { listId, viewer });
          });

          if (clients.has(userId)) {
            const { socketId } = clients.get(userId);
            const dataMap = _keyBy(lists, '_id');

            socket.broadcast
              .to(socketId)
              .emit(ListActionTypes.FETCH_META_DATA_SUCCESS, dataMap);
          }
        }
      });
  });

const addListViewer = (io, dashboardClients, cohortClients) => data => {
  const { listId, _id: viewerId } = data;

  io.sockets
    .to(listChannel(listId))
    .emit(ListActionTypes.ADD_VIEWER_SUCCESS, data);

  return List.findById(listId)
    .lean()
    .exec()
    .then(doc => {
      if (doc) {
        const { cohortId } = doc;
        const list = responseWithList(doc, viewerId);

        if (cohortId && cohortClients.has(viewerId)) {
          const { viewId, socketId } = cohortClients.get(viewerId);

          if (viewId === cohortId.toString()) {
            io.sockets
              .to(socketId)
              .emit(ListActionTypes.FETCH_META_DATA_SUCCESS, {
                [listId]: list
              });
          }
        }

        if (dashboardClients.has(viewerId)) {
          const { socketId } = dashboardClients.get(viewerId);

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

const changeItemOrderState = (
  socket,
  dashboardViewClients,
  cohortViewClients
) => {
  socket.on(ItemActionTypes.TOGGLE_SUCCESS, data => {
    const { listId } = data;

    // send to users that are on the list view
    socket.broadcast
      .to(listChannel(listId))
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
      .to(listChannel(listId))
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

const updateListHeaderState = (socket, listClientLocks) => {
  socket.on(ListHeaderStatusTypes.UNLOCK, data => {
    const { descriptionLock, listId, nameLock, userId } = data;

    socket.broadcast
      .to(listChannel(listId))
      .emit(ListHeaderStatusTypes.UNLOCK, data);

    if (listClientLocks.has(userId)) {
      clearTimeout(listClientLocks.get(userId));
      listClientLocks.delete(userId);
    }

    const locks = { description: descriptionLock, name: nameLock };

    handleLocks(List, { _id: listId })(locks);
  });

  socket.on(ListHeaderStatusTypes.LOCK, data => {
    const { descriptionLock, listId, nameLock, userId } = data;

    socket.broadcast
      .to(listChannel(listId))
      .emit(ListHeaderStatusTypes.LOCK, data);

    const delayedUnlock = setTimeout(() => {
      const { listId } = data;
      const updatedData = { listId };

      if (isDefined(nameLock)) {
        updatedData.nameLock = false;
      }

      if (isDefined(descriptionLock)) {
        updatedData.descriptionLock = false;
      }

      socket.broadcast
        .to(`sack-${listId}`)
        .emit(ListHeaderStatusTypes.UNLOCK, updatedData);

      listClientLocks.delete(userId);
    }, LOCK_TIMEOUT);

    listClientLocks.set(userId, delayedUnlock);

    const locks = { description: descriptionLock, name: nameLock };

    handleLocks(List, { _id: listId })(locks);
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

const removeMemberRoleInList = (socket, clients) => {
  socket.on(ListActionTypes.REMOVE_MEMBER_ROLE_SUCCESS, data => {
    const { listId, userId } = data;

    socket.broadcast
      .to(listChannel(listId))
      .emit(ListActionTypes.REMOVE_MEMBER_ROLE_SUCCESS, {
        ...data,
        isCurrentUserRoleChanging: false
      });

    if (clients.has(userId)) {
      const { viewId, socketId } = clients.get(userId);

      if (viewId === listId) {
        socket.broadcast
          .to(socketId)
          .emit(ListActionTypes.REMOVE_MEMBER_ROLE_SUCCESS, {
            ...data,
            isCurrentUserRoleChanging: true
          });
      }
    }
  });
};

const removeOwnerRoleInList = (socket, clients) => {
  socket.on(ListActionTypes.REMOVE_OWNER_ROLE_SUCCESS, data => {
    const { listId, userId } = data;

    socket.broadcast
      .to(listChannel(listId))
      .emit(ListActionTypes.REMOVE_OWNER_ROLE_SUCCESS, {
        ...data,
        isCurrentUserRoleChanging: false
      });

    if (clients.has(userId)) {
      const { viewId, socketId } = clients.get(userId);

      if (viewId === listId) {
        socket.broadcast
          .to(socketId)
          .emit(ListActionTypes.REMOVE_OWNER_ROLE_SUCCESS, {
            ...data,
            isCurrentUserRoleChanging: true
          });
      }
    }
  });
};

const leaveList = socket =>
  socket.on(ListActionTypes.LEAVE_SUCCESS, data => {
    const { listId } = data;

    socket.broadcast
      .to(listChannel(listId))
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
              .to(listChannel(listId))
              .emit(ListActionTypes.REMOVE_MEMBER_SUCCESS, { listId, userId })
          );
        }
      });
  });

const changeListType = (
  io,
  dashboardClients,
  cohortClients,
  listClients
) => data => {
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

const emitListsOnRemoveCohortMember = (socket, dashboardClients, listClients) =>
  socket.on(CohortActionTypes.REMOVE_MEMBER_SUCCESS, data => {
    const { cohortId, userId } = data;

    List.find({ cohortId })
      .populate('cohortId', 'memberIds')
      .lean()
      .exec()
      .then(docs => {
        if (docs) {
          const {
            cohortId: { memberIds: cohortMemberIds }
          } = docs[0];
          const listIdsUserWasRemovedFrom = [];
          const listIdsUserRemained = [];

          docs.forEach(doc => {
            const { type } = doc;
            const listId = doc._id.toString();

            if (isViewer(doc, userId)) {
              listIdsUserRemained.push(listId);
            } else if (type === ListType.SHARED) {
              listIdsUserWasRemovedFrom.push(listId);
            }
          });

          if (listIdsUserWasRemovedFrom.length > 0) {
            if (dashboardClients.has(userId)) {
              const { socketId } = dashboardClients.get(userId);

              socket.broadcast
                .to(socketId)
                .emit(ListActionTypes.REMOVE_BY_IDS, listIdsUserWasRemovedFrom);
            }

            listIdsUserWasRemovedFrom.forEach(listId => {
              socket.broadcast
                .to(listChannel(listId))
                .emit(ListActionTypes.REMOVE_MEMBER_SUCCESS, {
                  listId,
                  userId
                });

              if (listClients.has(userId)) {
                const { socketId, viewId } = listClients.get(userId);
                const isCohortMember = checkIfArrayContainsUserId(
                  cohortMemberIds,
                  userId
                );

                if (viewId === listId) {
                  socket.broadcast
                    .to(socketId)
                    .emit(ListActionTypes.REMOVED_BY_SOMEONE, {
                      cohortId,
                      isCohortMember,
                      listId
                    });
                }
              }
            });
          }

          if (listIdsUserRemained.length > 0) {
            listIdsUserRemained.forEach(listId => {
              if (listClients.has(userId)) {
                const { socketId, viewId } = listClients.get(userId);

                if (viewId === listId) {
                  socket.broadcast
                    .to(socketId)
                    .emit(ListActionTypes.MEMBER_UPDATE_SUCCESS, {
                      isCurrentUserUpdated: true,
                      isGuest: true,
                      listId,
                      userId
                    });
                }
              }

              socket.broadcast
                .to(listChannel(listId))
                .emit(ListActionTypes.MEMBER_UPDATE_SUCCESS, {
                  isCurrentUserUpdated: false,
                  isGuest: true,
                  listId,
                  userId
                });
            });
          }
        }
      });
  });

const removeListMember = (
  socket,
  dashboardClients,
  listClients,
  cohortClients
) =>
  socket.on(ListActionTypes.REMOVE_MEMBER_SUCCESS, data => {
    const { listId, userId } = data;

    if (dashboardClients.has(userId)) {
      const { socketId } = dashboardClients.get(userId);

      socket.broadcast
        .to(socketId)
        .emit(ListActionTypes.DELETE_SUCCESS, { listId });
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

              socket.broadcast
                .to(socketId)
                .emit(ListActionTypes.REMOVED_BY_SOMEONE, data);
            }
          }
        });
    }

    if (cohortClients.has(userId)) {
      const { socketId } = cohortClients.get(userId);

      socket.broadcast
        .to(socketId)
        .emit(ListActionTypes.DELETE_SUCCESS, { listId });
    }

    socket.broadcast
      .to(`sack-${listId}`)
      .emit(ListActionTypes.REMOVE_MEMBER_SUCCESS, { listId, userId });
  });

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
      const { viewersIds, cohortId: cohort } = doc;
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
            .emit(ListActionTypes.FETCH_ARCHIVED_META_DATA_SUCCESS, {
              [listId]: {
                ...responseWithList(list, viewerId),
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
                  ...responseWithList(list, viewerId),
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

  dashboardClients.forEach(client => {
    const { socketId } = client;

    io.sockets.to(socketId).emit(ListActionTypes.DELETE_SUCCESS, { listId });
  });

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

const restoreList = (socket, dashboardClients, cohortClients, listClients) =>
  socket.on(ListActionTypes.RESTORE_SUCCESS, listData => {
    const {
      listId,
      data,
      data: { cohortId }
    } = listData;

    List.findById(listId)
      .lean()
      .exec()
      .then(doc => {
        const { viewersIds, memberIds } = doc;

        viewersIds.forEach(viewerId => {
          const id = viewerId.toString();

          if (dashboardClients.has(id)) {
            const { socketId } = dashboardClients.get(id);

            socket.broadcast
              .to(socketId)
              .emit(ListActionTypes.FETCH_META_DATA_SUCCESS, {
                [listId]: responseWithList(doc, id)
              });
          }

          if (cohortClients.has(id)) {
            const { socketId, viewId } = cohortClients.get(id);

            if (viewId === cohortId) {
              socket.broadcast
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
              socket.broadcast
                .to(socketId)
                .emit(ListActionTypes.RESTORE_SUCCESS, {
                  data,
                  listId
                });
            }
          }
        });
      });
  });

const removeListsOnArchiveCohort = (socket, dashboardClients) =>
  socket.on(CohortActionTypes.ARCHIVE_SUCCESS, data => {
    const { cohortId } = data;

    List.find({
      cohortId
    })
      .lean()
      .exec()
      .then(docs => {
        if (docs) {
          const listIds = docs.map(list => list._id.toString());
          const listsByViewers = getListIdsByViewers(docs);

          listIds.forEach(listId => {
            socket.broadcast
              .to(listChannel(listId))
              .emit(ListActionTypes.REMOVE_WHEN_COHORT_UNAVAILABLE, {
                cohortId,
                listId
              });
          });

          Object.keys(listsByViewers).forEach(viewerId => {
            if (dashboardClients.has(viewerId)) {
              const { socketId } = dashboardClients.get(viewerId);
              const listsToRemoved = listsByViewers[viewerId];

              socket.broadcast
                .to(socketId)
                .emit(ListActionTypes.REMOVE_BY_IDS, listsToRemoved);
            }
          });
        }
      });
  });

const emitListsOnRestoreCohort = (socket, dashboardClients, cohortClients) =>
  socket.on(CohortActionTypes.RESTORE_SUCCESS, data => {
    const { cohortId } = data;

    List.find({ cohortId, isArchived: false })
      .populate('cohortId', 'ownerIds')
      .lean()
      .exec()
      .then(docs => {
        if (docs) {
          const {
            cohortId: { ownerIds: cohortOwners }
          } = docs[0];
          const listsByUsers = getListsDataByViewers(docs);

          cohortOwners.forEach(id => {
            const cohortOwnerId = id.toString();

            if (cohortClients.has(cohortOwnerId)) {
              const { socketId, viewId } = cohortClients.get(cohortOwnerId);

              if (viewId === cohortId) {
                const listsToSend = listsByUsers[cohortOwnerId];

                socket.broadcast
                  .to(socketId)
                  .emit(ListActionTypes.FETCH_META_DATA_SUCCESS, listsToSend);
              }
            }
          });

          Object.keys(listsByUsers).forEach(viewerId => {
            if (dashboardClients.has(viewerId)) {
              const { socketId } = dashboardClients.get(viewerId);
              const listsToSend = listsByUsers[viewerId];

              socket.broadcast
                .to(socketId)
                .emit(ListActionTypes.FETCH_META_DATA_SUCCESS, listsToSend);
            }
          });
        }
      });
  });

module.exports = {
  addComment,
  addItemToList,
  addListViewer,
  addMemberRoleInList,
  addOwnerRoleInList,
  archiveItem,
  archiveList,
  changeItemOrderState,
  changeListType,
  clearVote,
  cloneItem,
  deleteItem,
  deleteList,
  emitListsOnAddCohortMember,
  emitListsOnRemoveCohortMember,
  emitListsOnRestoreCohort,
  emitRemoveMemberOnLeaveCohort,
  leaveList,
  removeListMember,
  removeListsOnArchiveCohort,
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
