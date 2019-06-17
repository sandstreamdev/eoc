const { ItemActionTypes } = require('./common/variables');

module.exports.listen = io => {
  io.of('/sack').on('connection', socket => {
    const {
      request: { user }
    } = socket;
    const userExist = user || false;

    if (userExist) {
      socket.on('listRoom', room => {
        socket.join(room);
      });

      socket.on(ItemActionTypes.ADD_SUCCESS, data => {
        socket
          .to(`list-${data.listId}`)
          .emit(ItemActionTypes.ADD_SUCCESS, data);
      });

      socket.on('leavingRoom', listId => {
        socket.leave(`list-${listId}`);
      });
    }
  });
};
