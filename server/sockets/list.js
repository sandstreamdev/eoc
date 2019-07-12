const {
  ItemActionTypes,
  ItemStatusType,
  CohortActionTypes,
  CommentActionTypes,
  ListActionTypes,
  ListType
} = require('../common/variables');
const List = require('../models/list.model');
const { responseWithListsMetaData } = require('../common/utils');

/* WS postfix stands for Web Socket, to differentiate
 * this from controllers naming convention
 */
const addItemToListWS = socket => {
  socket.on(ItemActionTypes.ADD_SUCCESS, data => {
    socket.broadcast
      .to(`list-${data.listId}`)
      .emit(ItemActionTypes.ADD_SUCCESS, data);
  });
};

const archiveItemWS = socket => {
  socket.on(ItemActionTypes.ARCHIVE_SUCCESS, data => {
    socket.broadcast
      .to(`list-${data.listId}`)
      .emit(ItemActionTypes.ARCHIVE_SUCCESS, data);
  });
};

const deleteItemWS = socket => {
  socket.on(ItemActionTypes.DELETE_SUCCESS, data => {
    socket.broadcast
      .to(`list-${data.listId}`)
      .emit(ItemActionTypes.DELETE_SUCCESS, data);
  });
};

const restoreItemWS = socket => {
  socket.on(ItemActionTypes.RESTORE_SUCCESS, data => {
    socket.broadcast
      .to(`list-${data.listId}`)
      .emit(ItemActionTypes.RESTORE_SUCCESS, data);
  });
};

const updateItemState = socket => {
  socket.on(ItemStatusType.BUSY, data => {
    const { listId } = data;

    socket.broadcast.to(`list-${listId}`).emit(ItemStatusType.BUSY, data);
  });

  socket.on(ItemStatusType.FREE, data => {
    const { listId } = data;

    socket.broadcast.to(`list-${listId}`).emit(ItemStatusType.FREE, data);
  });
};

const updateItemWS = socket => {
  socket.on(ItemActionTypes.UPDATE_SUCCESS, data =>
    socket.broadcast
      .to(`list-${data.listId}`)
      .emit(ItemActionTypes.UPDATE_SUCCESS, data)
  );
};

const addCommentWS = socket => {
  socket.on(CommentActionTypes.ADD_SUCCESS, data =>
    socket.broadcast
      .to(`list-${data.listId}`)
      .emit(CommentActionTypes.ADD_SUCCESS, data)
  );
};

const sendListsOnAddCohortMember = (socket, clients) =>
  socket.on(CohortActionTypes.ADD_MEMBER_SUCCESS, data => {
    const {
      cohortId,
      json: { _id: userId }
    } = data;

    List.find(
      {
        cohortId,
        type: ListType.SHARED
      },
      '_id cohortId name description items favIds type'
    )
      .lean()
      .exec()
      .then(docs => {
        if (docs) {
          const lists = responseWithListsMetaData(docs, userId);
          const sharedListIds = lists.map(list => list._id.toString());
          const { json } = data;
          const member = {
            ...json,
            isMember: false,
            isViewer: true
          };

          // sends new cohort's member data to all users
          // on cohort's shared lists views
          sharedListIds.forEach(listId => {
            socket.broadcast
              .to(`list-${listId}`)
              .emit(ListActionTypes.ADD_VIEWER_SUCCESS, { listId, member });
          });

          // sends shared lists metadata to new cohort
          // member if they are already on dashboard
          if (clients.has(userId)) {
            socket.broadcast
              .to(clients.get(userId))
              .emit(ListActionTypes.FETCH_META_DATA_SUCCESS, lists);
          }
        }
      });
  });

module.exports = {
  addCommentWS,
  addItemToListWS,
  archiveItemWS,
  deleteItemWS,
  restoreItemWS,
  sendListsOnAddCohortMember,
  updateItemState,
  updateItemWS
};
