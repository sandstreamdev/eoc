const _keyBy = require('lodash/keyBy');

const { ListType, LOCK_TIMEOUT } = require('../common/variables');
const {
  AppEvents,
  CohortActionTypes,
  CohortHeaderStatusTypes,
  ListActionTypes
} = require('./eventTypes');
const Cohort = require('../models/cohort.model');
const {
  responseWithCohort,
  responseWithCohortDetails,
  responseWithListsMetaData
} = require('../common/utils');
const {
  cohortChannel,
  cohortMetaDataChannel,
  descriptionLockId,
  emitRemoveCohortMember,
  emitRoleChange,
  getListsDataByViewers,
  getUserSockets,
  handleLocks,
  nameLockId,
  listChannel,
  listMetaDataChannel
} = require('./helpers');
const { isDefined } = require('../common/utils');
const List = require('../models/list.model');

const addMember = io => async data => {
  const {
    cohortId,
    member: { _id: userId }
  } = data;

  io.sockets
    .to(cohortChannel(cohortId))
    .emit(CohortActionTypes.ADD_MEMBER_SUCCESS, data);

  try {
    const cohort = await Cohort.findById(cohortId)
      .lean()
      .exec();

    const lists = await List.find(
      {
        cohortId,
        type: ListType.SHARED
      },
      '_id cohortId createdAt description favIds items memberIds name ownerIds type'
    )
      .lean()
      .populate('cohortId', 'memberIds ownerIds')
      .exec();

    const membersCount = cohort.memberIds.length;
    const socketIds = await getUserSockets(userId);

    socketIds.forEach(socketId =>
      io.sockets
        .to(socketId)
        .emit(AppEvents.JOIN_ROOM, cohortMetaDataChannel(cohortId))
    );

    io.sockets
      .to(cohortMetaDataChannel(cohortId))
      .emit(CohortActionTypes.UPDATE_SUCCESS, { cohortId, membersCount });

    socketIds.forEach(socketId =>
      io.sockets.to(socketId).emit(CohortActionTypes.FETCH_META_DATA_SUCCESS, {
        [cohortId]: responseWithCohort(cohort, userId)
      })
    );

    const listsToSend = responseWithListsMetaData(lists, userId);
    const sharedListIds = listsToSend.map(list => list._id.toString());
    const { member } = data;
    const viewer = {
      ...member,
      isMember: false,
      isViewer: true
    };
    const dataMap = _keyBy(listsToSend, '_id');

    sharedListIds.forEach(listId => {
      io.sockets
        .to(listChannel(listId))
        .emit(ListActionTypes.ADD_VIEWER_SUCCESS, {
          listId,
          viewer
        });

      socketIds.forEach(socketId =>
        io.sockets
          .to(socketId)
          .emit(AppEvents.JOIN_ROOM, listMetaDataChannel(listId))
      );
    });

    socketIds.forEach(socketId =>
      io.sockets
        .to(socketId)
        .emit(ListActionTypes.FETCH_META_DATA_SUCCESS, dataMap)
    );
  } catch (err) {
    // Ignore errors
  }
};

const leaveCohort = io => async data => {
  try {
    await emitRemoveCohortMember(io, CohortActionTypes.LEAVE_SUCCESS)(data);
  } catch {
    // Ignore errors
  }
};

const addOwnerRole = io => async data => {
  const { cohortId } = data;

  try {
    await emitRoleChange(io)(
      cohortChannel(cohortId),
      CohortActionTypes.ADD_OWNER_ROLE_SUCCESS
    )(data);
  } catch {
    // Ignore errors
  }
};

const removeOwnerRole = io => async data => {
  const { cohortId } = data;

  try {
    await emitRoleChange(io)(
      cohortChannel(cohortId),
      CohortActionTypes.REMOVE_OWNER_ROLE_SUCCESS
    )(data);
  } catch {
    // Ignore errors
  }
};

const updateCohort = io => async data => {
  const { cohortId, name } = data;

  io.sockets
    .to(cohortChannel(cohortId))
    .emit(CohortActionTypes.UPDATE_SUCCESS, data);

  io.sockets
    .to(cohortMetaDataChannel(cohortId))
    .emit(CohortActionTypes.UPDATE_SUCCESS, data);

  if (isDefined(name)) {
    try {
      const lists = await List.find(
        { cohortId, isDeleted: false },
        '_id'
      ).exec();

      lists.forEach(list =>
        io.sockets
          .to(listChannel(list._id))
          .emit(ListActionTypes.UPDATE_SUCCESS, {
            listId: list._id,
            cohortName: name
          })
      );
    } catch {
      // Ignore error
    }
  }
};

const updateCohortHeaderStatus = (socket, cohortClientLocks) => {
  socket.on(CohortHeaderStatusTypes.UNLOCK, data => {
    const { cohortId, descriptionLock, nameLock, userId } = data;
    const locks = { description: descriptionLock, name: nameLock };

    handleLocks(Cohort, { _id: cohortId, ownerIds: userId })(locks).then(() => {
      socket.broadcast
        .to(cohortChannel(cohortId))
        .emit(CohortHeaderStatusTypes.UNLOCK, { cohortId, locks });

      const lock = isDefined(nameLock) ? nameLockId : descriptionLockId;

      if (cohortClientLocks.has(lock(cohortId))) {
        clearTimeout(cohortClientLocks.get(lock(cohortId)));
        cohortClientLocks.delete(lock(cohortId));
      }
    });
  });

  socket.on(CohortHeaderStatusTypes.LOCK, data => {
    const { cohortId, descriptionLock, nameLock, userId } = data;
    const locks = { description: descriptionLock, name: nameLock };

    handleLocks(Cohort, { _id: cohortId, ownerIds: userId })(locks).then(() => {
      socket.broadcast
        .to(cohortChannel(cohortId))
        .emit(CohortHeaderStatusTypes.LOCK, { cohortId, locks });

      const lock = isDefined(nameLock) ? nameLockId : descriptionLockId;
      const delayedUnlock = setTimeout(() => {
        if (isDefined(nameLock)) {
          locks.name = false;
        }

        if (isDefined(descriptionLock)) {
          locks.description = false;
        }

        handleLocks(Cohort, { _id: cohortId, ownerIds: userId })(locks).then(
          () => {
            socket.broadcast
              .to(cohortChannel(cohortId))
              .emit(CohortHeaderStatusTypes.UNLOCK, { cohortId, locks });
            clearTimeout(cohortClientLocks.get(lock(cohortId)));
            cohortClientLocks.delete(lock(cohortId));
          }
        );
      }, LOCK_TIMEOUT);

      cohortClientLocks.set(lock(cohortId), delayedUnlock);
    });
  });
};

const archiveCohort = io => async data => {
  const { cohortId, performer } = data;

  io.sockets
    .to(cohortChannel(cohortId))
    .emit(CohortActionTypes.ARCHIVE_SUCCESS, { cohortId, performer });

  io.sockets
    .to(cohortMetaDataChannel(cohortId))
    .emit(CohortActionTypes.ARCHIVE_SUCCESS, { cohortId, performer });

  try {
    const lists = await List.find({ cohortId, isDeleted: false }, '_id')
      .lean()
      .exec();

    const listIds = lists.map(list => list._id.toString());

    listIds.forEach(id => {
      const listId = id.toString();

      io.sockets
        .to(listChannel(listId))
        .emit(ListActionTypes.ARCHIVE_COHORT_SUCCESS, {
          listId,
          performer
        });

      io.sockets
        .to(listMetaDataChannel(listId))
        .emit(ListActionTypes.ARCHIVE_COHORT_SUCCESS, {
          listId
        });
    });
  } catch {
    // Ignore errors
  }
};

const removeMember = io => async data => {
  try {
    await emitRemoveCohortMember(
      io,
      CohortActionTypes.REMOVE_MEMBER_SUCCESS
    )(data);
  } catch {
    // Ignore errors
  }
};

const deleteCohort = io => async data => {
  const { cohortId, memberIds, performer } = data;

  io.sockets
    .to(cohortChannel(cohortId))
    .emit(CohortActionTypes.DELETE_SUCCESS, { cohortId, performer });

  io.sockets
    .to(cohortMetaDataChannel(cohortId))
    .emit(CohortActionTypes.DELETE_SUCCESS, { cohortId });

  await Promise.all(
    memberIds.map(async id => {
      const memberId = id.toString();

      try {
        const socketIds = await getUserSockets(memberId);

        socketIds.forEach(socketId =>
          io.sockets
            .to(socketId)
            .emit(CohortActionTypes.LEAVE_ROOM, cohortMetaDataChannel(cohortId))
        );
      } catch {
        // Ignore errors
      }
    })
  );
};

const restoreCohort = io => async data => {
  const { cohortId, cohort } = data;
  const { memberIds: members } = cohort;

  try {
    await Promise.all(
      members.map(async member => {
        const memberId = member._id.toString();
        const cohortToSend = responseWithCohortDetails(cohort, memberId);

        try {
          const socketIds = await getUserSockets(memberId);

          socketIds.forEach(socketId =>
            io.sockets.to(socketId).emit(CohortActionTypes.RESTORE_SUCCESS, {
              cohortId,
              data: cohortToSend
            })
          );
        } catch {
          // Ignore errors
        }
      })
    );

    const lists = await List.find({ cohortId, isArchived: false })
      .populate('cohortId', 'memberIds name, ownerIds')
      .lean()
      .exec();

    if (lists && lists.length > 0) {
      const listsByUsers = getListsDataByViewers(lists);

      await Promise.all(
        Object.keys(listsByUsers).map(async viewerId => {
          const listsToSend = listsByUsers[viewerId];

          try {
            const socketIds = await getUserSockets(viewerId);

            socketIds.forEach(socketId => {
              io.sockets
                .to(socketId)
                .emit(ListActionTypes.FETCH_META_DATA_SUCCESS, listsToSend);
            });
          } catch {
            // Ignore errors
          }
        })
      );
    }
  } catch {
    // Ignore errors
  }
};

module.exports = {
  addMember,
  addOwnerRole,
  archiveCohort,
  deleteCohort,
  leaveCohort,
  removeMember,
  removeOwnerRole,
  restoreCohort,
  updateCohort,
  updateCohortHeaderStatus
};
