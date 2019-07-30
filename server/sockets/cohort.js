const {
  CohortActionTypes,
  CohortHeaderStatusTypes
} = require('../common/variables');
const Cohort = require('../models/cohort.model');
const {
  checkIfArrayContainsUserId,
  responseWithCohort,
  responseWithCohortMembers
} = require('../common/utils');
const { emitCohortMetaData, removeCohort } = require('./helpers');

const addCohortMember = (socket, clients) =>
  socket.on(CohortActionTypes.ADD_MEMBER_SUCCESS, data => {
    const { cohortId } = data;

    socket.broadcast
      .to(`cohort-${cohortId}`)
      .emit(CohortActionTypes.ADD_MEMBER_SUCCESS, data);

    if (clients.size > 0) {
      emitCohortMetaData(cohortId, clients, socket);
    }
  });

const leaveCohort = (socket, clients) =>
  socket.on(CohortActionTypes.LEAVE_SUCCESS, data => {
    const { cohortId } = data;

    socket.broadcast
      .to(`cohort-${cohortId}`)
      .emit(CohortActionTypes.REMOVE_MEMBER_SUCCESS, data);

    if (clients.size > 0) {
      emitCohortMetaData(cohortId, clients, socket);
    }
  });

const addOwnerRoleInCohort = (socket, clients) => {
  socket.on(CohortActionTypes.ADD_OWNER_ROLE_SUCCESS, data => {
    const { cohortId, userId } = data;

    socket.broadcast
      .to(`cohort-${cohortId}`)
      .emit(CohortActionTypes.ADD_OWNER_ROLE_SUCCESS, {
        ...data,
        isCurrentUserRoleChanging: false
      });

    if (clients.has(userId)) {
      const { viewId, socketId } = clients.get(userId);

      if (viewId === cohortId) {
        socket.broadcast
          .to(socketId)
          .emit(CohortActionTypes.ADD_OWNER_ROLE_SUCCESS, {
            ...data,
            isCurrentUserRoleChanging: true
          });
      }
    }
  });
};

const removeOwnerRoleInCohort = (socket, clients) => {
  socket.on(CohortActionTypes.REMOVE_OWNER_ROLE_SUCCESS, data => {
    const { cohortId, userId } = data;

    socket.broadcast
      .to(`cohort-${cohortId}`)
      .emit(CohortActionTypes.REMOVE_OWNER_ROLE_SUCCESS, {
        ...data,
        isCurrentUserRoleChanging: false
      });

    if (clients.has(userId)) {
      const { viewId, socketId } = clients.get(userId);

      if (viewId === cohortId) {
        socket.broadcast
          .to(socketId)
          .emit(CohortActionTypes.REMOVE_OWNER_ROLE_SUCCESS, {
            ...data,
            isCurrentUserRoleChanging: true
          });
      }
    }
  });
};

const updateCohort = (socket, allCohortsViewClients) => {
  socket.on(CohortActionTypes.UPDATE_SUCCESS, data => {
    const { cohortId } = data;

    socket.broadcast
      .to(`cohort-${cohortId}`)
      .emit(CohortActionTypes.UPDATE_SUCCESS, data);

    if (allCohortsViewClients.size > 0) {
      Cohort.findOne({
        _id: cohortId
      })
        .lean()
        .exec()
        .then(doc => {
          if (doc) {
            const { memberIds } = doc;
            const cohort = responseWithCohort(doc);

            memberIds.forEach(id => {
              const memberId = id.toString();

              if (allCohortsViewClients.has(memberId)) {
                const { socketId } = allCohortsViewClients.get(memberId);

                socket.broadcast
                  .to(socketId)
                  .emit(CohortActionTypes.UPDATE_SUCCESS, cohort);
              }
            });
          }
        });
    }
  });
};

const updateCohortHeaderStatus = socket => {
  socket.on(CohortHeaderStatusTypes.UNLOCK, data => {
    const { cohortId } = data;

    socket.broadcast
      .to(`cohort-${cohortId}`)
      .emit(CohortHeaderStatusTypes.UNLOCK, data);
  });

  socket.on(CohortHeaderStatusTypes.LOCK, data => {
    const { cohortId } = data;

    socket.broadcast
      .to(`cohort-${cohortId}`)
      .emit(CohortHeaderStatusTypes.LOCK, data);
  });
};

const archiveCohort = (socket, allCohortsClients) =>
  socket.on(CohortActionTypes.ARCHIVE_SUCCESS, data => {
    const { cohortId } = data;

    Cohort.findOne({
      _id: cohortId
    })
      .lean()
      .exec()
      .then(doc => {
        if (doc) {
          const { memberIds } = doc;

          removeCohort(socket, cohortId, allCohortsClients, memberIds);
        }
      });
  });

const deleteCohort = (socket, allCohortsClients) =>
  socket.on(CohortActionTypes.DELETE_SUCCESS, data => {
    const { cohortId, members } = data;

    removeCohort(socket, cohortId, allCohortsClients, members);
  });

const responseWithCohortDetails = (doc, userId) => {
  const {
    _id,
    createdAt,
    description,
    isArchived,
    memberIds: membersCollection,
    name,
    ownerIds
  } = doc;

  const isOwner = checkIfArrayContainsUserId(ownerIds, userId);
  const members = responseWithCohortMembers(membersCollection, ownerIds);

  return {
    _id,
    createdAt,
    description,
    isArchived,
    isMember: true,
    isOwner,
    members,
    name
  };
};

const restoreCohort = (socket, allCohortsClients, cohortClients) =>
  socket.on(CohortActionTypes.RESTORE_SUCCESS, data => {
    const { cohortId } = data;
    Cohort.findById(cohortId)
      .populate('memberIds', 'avatarUrl displayName _id')
      .lean()
      .exec()
      .then(doc => {
        if (doc) {
          const { memberIds, ownerIds } = doc;
          const cohortMetaData = responseWithCohort(doc);

          ownerIds.forEach(id => {
            const ownerId = id.toString();

            if (cohortClients.has(ownerId)) {
              const { socketId } = cohortClients.get(ownerId);

              socket.broadcast
                .to(socketId)
                .emit(
                  CohortActionTypes.FETCH_DETAILS_SUCCESS,
                  responseWithCohortDetails(doc, ownerId)
                );
            }
          });

          memberIds.forEach(member => {
            const { _id } = member;
            const memberId = _id.toString();

            if (allCohortsClients.has(memberId)) {
              const { socketId } = allCohortsClients.get(memberId);

              socket.broadcast
                .to(socketId)
                .emit(CohortActionTypes.FETCH_META_DATA_SUCCESS, {
                  [cohortId]: cohortMetaData
                });
            }
          });
        }
      });
  });

module.exports = {
  addCohortMember,
  addOwnerRoleInCohort,
  archiveCohort,
  deleteCohort,
  leaveCohort,
  removeOwnerRoleInCohort,
  restoreCohort,
  updateCohort,
  updateCohortHeaderStatus
};
