const { UserEvents } = require('./eventTypes');
const { getUserSockets } = require('./helpers');

const logout = io => async userId => {
  const socketIds = await getUserSockets(userId);

  socketIds.forEach(socketId =>
    io.sockets.to(socketId).emit(UserEvents.LOGOUT_SUCCESS)
  );
};

module.exports = { logout };
