const io = require('socket.io');
const passportSocketIo = require('passport.socketio');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const cookieParser = require('cookie-parser');

const {
  addComment,
  addItemToList,
  archiveItem,
  changeItemOrderState,
  clearVote,
  cloneItem,
  deleteItem,
  emitListsOnAddCohortMember,
  emitListsOnRemoveCohortMember,
  emitListsOnRestoreCohort,
  emitRemoveMemberOnLeaveCohort,
  removeListsOnArchiveCohort,
  restoreItem,
  restoreList,
  setVote,
  updateItem,
  updateItemState,
  updateList,
  updateListHeaderState
} = require('./list');
const {
  addCohortMember,
  addOwnerRoleInCohort,
  archiveCohort,
  deleteCohort,
  leaveCohort,
  removeCohortMember,
  removeOwnerRoleInCohort,
  restoreCohort,
  updateCohort,
  updateCohortHeaderStatus
} = require('./cohort');
const { SOCKET_TIMEOUT } = require('../common/variables');

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

    socket.on('joinSackRoom', data => {
      const { room, userId, viewId } = data;

      socket.join(room);
      listViewClients.set(userId, { socketId: socket.id, viewId });
    });

    socket.on('leaveSackRoom', data => {
      const { room, userId } = data;

      socket.leave(room);
      listViewClients.delete(userId);
    });

    socket.on('joinCohortRoom', data => {
      const { room, userId, viewId } = data;

      socket.join(room);
      cohortViewClients.set(userId, { socketId: socket.id, viewId });
    });

    socket.on('leaveCohortRoom', data => {
      const { room, userId } = data;

      socket.leave(room);
      cohortViewClients.delete(userId);
    });

    socket.on('enterCohortsView', userId =>
      allCohortsViewClients.set(userId, { socketId: socket.id })
    );

    socket.on('leaveCohortsView', userId =>
      allCohortsViewClients.delete(userId)
    );

    socket.on('enterDashboardView', userId =>
      dashboardViewClients.set(userId, { socketId: socket.id })
    );

    socket.on('leaveDashboardView', userId =>
      dashboardViewClients.delete(userId)
    );

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
    changeItemOrderState(socket, dashboardViewClients, cohortViewClients);
    clearVote(socket);
    cloneItem(socket);
    deleteItem(socket);
    emitListsOnAddCohortMember(socket, dashboardViewClients);
    emitListsOnRestoreCohort(socket, dashboardViewClients, cohortViewClients);
    emitListsOnRemoveCohortMember(
      socket,
      dashboardViewClients,
      listViewClients
    );
    emitRemoveMemberOnLeaveCohort(socket);
    removeListsOnArchiveCohort(socket, dashboardViewClients);
    restoreItem(socket);
    restoreList(
      socket,
      dashboardViewClients,
      cohortViewClients,
      listViewClients
    );
    setVote(socket);
    updateItem(socket);
    updateItemState(socket, itemClientLocks);
    updateList(socket, dashboardViewClients, cohortViewClients);
    updateListHeaderState(socket, listClientLocks);

    addCohortMember(socket, allCohortsViewClients);
    addOwnerRoleInCohort(socket, cohortViewClients);
    archiveCohort(socket, allCohortsViewClients);
    deleteCohort(socket, allCohortsViewClients);
    leaveCohort(socket, allCohortsViewClients);
    removeCohortMember(socket, allCohortsViewClients, cohortViewClients);
    removeOwnerRoleInCohort(socket, cohortViewClients);
    restoreCohort(socket, allCohortsViewClients, cohortViewClients);
    updateCohort(socket, allCohortsViewClients);
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
