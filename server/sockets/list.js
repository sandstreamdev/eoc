const {
  ItemActionTypes,
  ItemStatusType,
  CommentActionTypes
} = require('../common/variables');

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

const addCommentWS = socket =>
  socket.on(CommentActionTypes.ADD_SUCCESS, data =>
    socket.broadcast
      .to(`list-${data.listId}`)
      .emit(CommentActionTypes.ADD_SUCCESS, data)
  );

const cloneItemWS = socket =>
  socket.on(ItemActionTypes.CLONE_SUCCESS, data =>
    socket.broadcast
      .to(`list-${data.listId}`)
      .emit(ItemActionTypes.CLONE_SUCCESS, data)
  );

module.exports = {
  addCommentWS,
  addItemToListWS,
  archiveItemWS,
  cloneItemWS,
  deleteItemWS,
  restoreItemWS,
  updateItemState,
  updateItemWS
};
