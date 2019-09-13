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
const { Routes } = require('../common/variables');
const { associateSocketWithSession } = require('./helpers');

const sessionStore = new MongoStore({
  mongooseConnection: mongoose.connection
});

let socketInstance;
const cohortViewClients = new Map();
const allCohortsViewClients = new Map();
const dashboardViewClients = new Map();
const listViewClients = new Map();
const cohortClientLocks = new Map();
const itemClientLocks = new Map();
const listClientLocks = new Map();

const getCohortViewClients = () => cohortViewClients;
const getAllCohortsViewClients = () => allCohortsViewClients;
const getDashboardViewClients = () => dashboardViewClients;
const getListViewClients = () => listViewClients;

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
};

const getSocketInstance = () => {
  if (!socketInstance) {
    throw new Error('Socket not initialized...');
  }

  return socketInstance;
};

const socketListeners = socketInstance => {
  socketInstance.on('connection', socket => {
    const {
      request: { user }
    } = socket;
    const userExist = user || false;

    if (!userExist) {
      return;
    }

    associateSocketWithSession(socket);

    socket.on('joinRoom', ({ data, room }) => {
      const { roomId, userId, viewId } = data;

      switch (room) {
        case Routes.LIST:
          socket.join(roomId);
          listViewClients.set(userId, { socketId: socket.id, viewId });
          break;
        case Routes.COHORT:
          socket.join(roomId);
          cohortViewClients.set(userId, { socketId: socket.id, viewId });
          break;
        default:
          break;
      }
    });

    socket.on('leaveRoom', ({ data, room }) => {
      const { roomId, userId } = data;

      switch (room) {
        case Routes.LIST:
          socket.leave(roomId);
          listViewClients.delete(userId);
          break;
        case Routes.COHORT:
          socket.leave(roomId);
          cohortViewClients.delete(userId);
          break;
        default:
          break;
      }
    });

    socket.on('enterView', ({ userId, view }) => {
      switch (view) {
        case Routes.COHORTS:
          allCohortsViewClients.set(userId, { socketId: socket.id });
          break;
        case Routes.DASHBOARD:
          dashboardViewClients.set(userId, { socketId: socket.id });
          break;
        default:
          break;
      }
    });

    socket.on('leaveView', ({ userId, view }) => {
      switch (view) {
        case Routes.DASHBOARD:
          dashboardViewClients.delete(userId);
          break;
        case Routes.COHORTS:
          allCohortsViewClients.delete(userId);
          break;
        default:
          break;
      }
    });

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

module.exports = {
  getAllCohortsViewClients,
  getCohortViewClients,
  getDashboardViewClients,
  getListViewClients,
  getSocketInstance,
  init: initSocket,
  listen: socketListeners
};
