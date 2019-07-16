const io = require('socket.io');
const passportSocketIo = require('passport.socketio');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const cookieParser = require('cookie-parser');

const sessionStore = new MongoStore({
  mongooseConnection: mongoose.connection
});
const {
  addComment,
  addItemToList,
  archiveItem,
  changeOrderState,
  clearVote,
  cloneItem,
  deleteItem,
  restoreItem,
  setVote,
  updateItem,
  updateItemState
} = require('./list');

const socketListenTo = server => {
  const ioInstance = io(server, { forceNew: true });

  ioInstance.use(
    passportSocketIo.authorize({
      key: 'connect.sid',
      secret: process.env.EXPRESS_SESSION_KEY,
      store: sessionStore,
      passport,
      cookieParser
    })
  );

  const dashboardClients = new Map();

  ioInstance.on('connection', socket => {
    const {
      request: { user }
    } = socket;
    const userExist = user || false;

    if (!userExist) {
      return;
    }

    // sack room
    socket.on('joinSackRoom', data => {
      const { room } = data;

      socket.join(room);
    });
    socket.on('leaveSackRoom', data => {
      const { room } = data;

      socket.leave(room);
    });

    // dashboard view
    socket.on('enterDashboardView', userId =>
      dashboardClients.set(userId, socket.id)
    );
    socket.on('leaveDashboardView', userId => dashboardClients.delete(userId));

    // cohort room
    socket.on('joinCohortRoom', data => {
      const { room } = data;

      socket.join(room);
    });
    socket.on('leaveCohortRoom', data => {
      const { room } = data;

      socket.leave(room);
    });

    socket.on('error', () => {
      /* Ignore error.
       * Don't show any information to a user
       * on the client app, because sockets are
       * not the main feature in this app
       */
    });

    addComment(socket);
    addItemToList(socket);
    archiveItem(socket);
    changeOrderState(socket, dashboardClients);
    clearVote(socket);
    cloneItem(socket);
    deleteItem(socket);
    restoreItem(socket);
    setVote(socket);
    updateItem(socket);
    updateItemState(socket);
  });
};

module.exports = socketListenTo;
