const io = require('socket.io');
const passportSocketIo = require('passport.socketio');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const cookieParser = require('cookie-parser');

const { updateItemState, updateListHeaderState } = require('./list');
const { updateCohortHeaderStatus } = require('./cohort');
const { SOCKET_TIMEOUT } = require('../common/variables');
const { associateSocketWithSession, joinMetaDataRooms } = require('./helpers');
const { AppEvents } = require('./eventTypes');

const sessionStore = new MongoStore({
  mongooseConnection: mongoose.connection
});

let socketInstance;
const cohortClientLocks = new Map();
const itemClientLocks = new Map();
const listClientLocks = new Map();

const getInstance = () => {
  if (!socketInstance) {
    throw new Error('Socket not initialized...');
  }

  return socketInstance;
};

const socketListeners = socketInstance => {
  socketInstance.on('connection', async socket => {
    const {
      request: { user }
    } = socket;
    const userExist = user || false;

    if (!userExist) {
      return;
    }

    await associateSocketWithSession(socket);
    await joinMetaDataRooms(socket);

    socket.on(AppEvents.JOIN_ROOM, room => socket.join(room));

    socket.on(AppEvents.LEAVE_ROOM, room => socket.leave(room));

    socket.on('error', () => {
      /* Ignore error.
       * Don't show any information to a user
       * on the client app, because sockets are
       * not the main feature in this app
       */
    });

    updateItemState(socket, itemClientLocks);

    // These method can not be refactored as they don't
    // have their own controllers
    updateListHeaderState(socket, listClientLocks);
    updateCohortHeaderStatus(socket, cohortClientLocks);
  });
};

const initSocket = server => {
  socketInstance = io(server, {
    forceNew: true,
    pingTimeout: SOCKET_TIMEOUT
  });

  socketInstance.use(
    passportSocketIo.authorize({
      key: 'connect.sid',
      secret: process.env.EXPRESS_SESSION_KEY,
      store: sessionStore,
      passport,
      cookieParser
    })
  );

  socketListeners(socketInstance);
};

module.exports = {
  getInstance,
  init: initSocket
};
