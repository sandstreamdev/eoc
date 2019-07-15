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
const {
  responseWithList,
  responseWithListsMetaData
} = require('../common/utils');

/* WS postfix stands for Web Socket, to differentiate
 * this from controllers naming convention
 */
const addItemToListWS = socket => {
  socket.on(ItemActionTypes.ADD_SUCCESS, data => {
    socket.broadcast
      .to(`sack-${data.listId}`)
      .emit(ItemActionTypes.ADD_SUCCESS, data);
  });
};

const archiveItemWS = socket => {
  socket.on(ItemActionTypes.ARCHIVE_SUCCESS, data => {
    socket.broadcast
      .to(`sack-${data.listId}`)
      .emit(ItemActionTypes.ARCHIVE_SUCCESS, data);
  });
};

const deleteItemWS = socket => {
  socket.on(ItemActionTypes.DELETE_SUCCESS, data => {
    socket.broadcast
      .to(`sack-${data.listId}`)
      .emit(ItemActionTypes.DELETE_SUCCESS, data);
  });
};

const restoreItemWS = socket => {
  socket.on(ItemActionTypes.RESTORE_SUCCESS, data => {
    socket.broadcast
      .to(`sack-${data.listId}`)
      .emit(ItemActionTypes.RESTORE_SUCCESS, data);
  });
};

const updateItemState = socket => {
  socket.on(ItemStatusType.BUSY, data => {
    const { listId } = data;

    socket.broadcast.to(`sack-${listId}`).emit(ItemStatusType.BUSY, data);
  });

  socket.on(ItemStatusType.FREE, data => {
    const { listId } = data;

    socket.broadcast.to(`sack-${listId}`).emit(ItemStatusType.FREE, data);
  });
};

const updateItemWS = socket => {
  socket.on(ItemActionTypes.UPDATE_SUCCESS, data =>
    socket.broadcast
      .to(`sack-${data.listId}`)
      .emit(ItemActionTypes.UPDATE_SUCCESS, data)
  );
};

const addCommentWS = socket => {
  socket.on(CommentActionTypes.ADD_SUCCESS, data =>
    socket.broadcast
      .to(`sack-${data.listId}`)
      .emit(CommentActionTypes.ADD_SUCCESS, data)
  );
};

const sendListsOnAddCohortMemberWS = (socket, clients) =>
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

const addListMemberWS = (socket, dashboardClients, cohortClients) => {
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
              .emit(ListActionTypes.CREATE_SUCCESS, list);
          }

          if (dashboardClients.has(viewerId)) {
            socket
              .to(dashboardClients.get(viewerId))
              .emit(ListActionTypes.CREATE_SUCCESS, list);
          }
        }
      });
  });
};

const addMemberRoleInListWS = (socket, clients) => {
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

const addOwnerRoleInListWS = (socket, clients) => {
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

const removeMemberRoleInListWS = (socket, clients) => {
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

const removeOwnerRoleInListWS = (socket, clients) => {
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

module.exports = {
  addCommentWS,
  addItemToListWS,
  addListMemberWS,
  addMemberRoleInListWS,
  addOwnerRoleInListWS,
  archiveItemWS,
  deleteItemWS,
  removeMemberRoleInListWS,
  removeOwnerRoleInListWS,
  restoreItemWS,
  sendListsOnAddCohortMemberWS,
  updateItemState,
  updateItemWS
};
