const { ItemActionTypes } = require('../common/variables');

/* WS postfix stands for Web Socket, to differentiate
 * this from controllers naming convention
 */
// TODO: do not send socket to sender(author)
const addItemToListWS = socket => {
  socket.on('listRoom', room => {
    socket.join(room);
  });

  socket.on(ItemActionTypes.ADD_SUCCESS, data => {
    socket.to(`list-${data.listId}`).emit(ItemActionTypes.ADD_SUCCESS, data);
  });

  socket.on('leavingRoom', listId => {
    socket.leave(`list-${listId}`);
  });
};

module.exports = {
  addItemToListWS
};
