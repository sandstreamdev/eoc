const { ItemActionTypes } = require('../common/variables');

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

const archiveItemWs = socket => {
  socket.on(ItemActionTypes.ARCHIVE_SUCCESS, data => {
    socket.broadcast
      .in(`list-${data.listId}`)
      .emit(ItemActionTypes.ARCHIVE_SUCCESS, data);
  });
};

const updateItemState = socket => {
  socket.on('item-busy', data => {
    const { listId } = data;

    console.log('item is busy');
    console.log(data);
    socket.broadcast.to(`list-${listId}`).emit('item-busy', data);
  });
};

module.exports = {
  addItemToListWS,
  archiveItemWs,
  updateItemState
};
