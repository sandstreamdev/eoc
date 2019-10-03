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
const { associateSocketWithSession, joinMetaDataRooms } = require('./helpers');
const { AppEvents } = require('./eventTypes');

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

    socket.on(AppEvents.JOIN_ROOM, emittedData => {
      /**
       * This check is for the old functionality to work.
       * After refactoring this handler will be simplified to:
       * socket.on('joinRoom', room => socket.join(room));
       * https://jira2.sanddev.com/browse/EOC-469
       */
      if (typeof emittedData === 'object') {
        const { data, room } = emittedData;
        const { userId, viewId, viewName } = data;

        switch (viewName) {
          case Routes.LIST: {
            socket.join(room);

            return listViewClients.set(userId, {
              socketId: socket.id,
              viewId
            });
          }
          case Routes.COHORT: {
            socket.join(room);

            return cohortViewClients.set(userId, {
              socketId: socket.id,
              viewId
            });
          }
          default:
            return;
        }
      }
      socket.join(emittedData);
    });

    socket.on(AppEvents.LEAVE_ROOM, emittedData => {
      if (typeof emittedData === 'object') {
        const { data, room } = emittedData;
        const { userId, viewName } = data;

        switch (viewName) {
          case Routes.LIST: {
            socket.leave(room);

            return listViewClients.delete(userId);
          }
          case Routes.COHORT: {
            socket.leave(room);

            return cohortViewClients.delete(userId);
          }
          default:
            return;
        }
      }

      socket.leave(emittedData);
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
  getAllCohortsViewClients,
  getCohortViewClients,
  getDashboardViewClients,
  getListViewClients,
  getInstance,
  init: initSocket
};
