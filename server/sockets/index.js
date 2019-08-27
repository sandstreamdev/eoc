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
  addListMember,
  addMemberRoleInList,
  addOwnerRoleInList,
  archiveItem,
  archiveList,
  changeItemOrderState,
  changeListType,
  clearVote,
  cloneItem,
  deleteItem,
  deleteList,
  emitListsOnAddCohortMember,
  emitListsOnRestoreCohort,
  emitListsOnRemoveCohortMember,
  emitRemoveMemberOnLeaveCohort,
  leaveList,
  removeListsOnArchiveCohort,
  removeListMember,
  removeMemberRoleInList,
  removeOwnerRoleInList,
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
  createListCohort,
  leaveCohort,
  removeCohortMember,
  removeOwnerRoleInCohort,
  restoreCohort,
  updateCohort,
  updateCohortHeaderStatus
} = require('./cohort');
const { SOCKET_TIMEOUT } = require('../common/variables');
const { Routes } = require('../common/variables');

const socketListenTo = server => {
  const ioInstance = io(server, {
    forceNew: true,
    pingTimeout: SOCKET_TIMEOUT
  });

  ioInstance.use(
    passportSocketIo.authorize({
      key: 'connect.sid',
      secret: process.env.EXPRESS_SESSION_KEY,
      store: sessionStore,
      passport,
      cookieParser
    })
  );

  const cohortViewClients = new Map();
  const allCohortsViewClients = new Map();
  const dashboardViewClients = new Map();
  const listViewClients = new Map();
  const cohortClientLocks = new Map();
  const itemClientLocks = new Map();
  const listClientLocks = new Map();

  ioInstance.on('connection', socket => {
    const {
      request: { user }
    } = socket;
    const userExist = user || false;

    if (!userExist) {
      return;
    }

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

    addComment(socket);
    addItemToList(socket, dashboardViewClients, cohortViewClients);
    addListMember(socket, dashboardViewClients, cohortViewClients);
    addMemberRoleInList(socket, listViewClients);
    addOwnerRoleInList(socket, listViewClients);
    archiveItem(socket, dashboardViewClients, cohortViewClients);
    archiveList(
      socket,
      dashboardViewClients,
      cohortViewClients,
      listViewClients
    );
    changeItemOrderState(socket, dashboardViewClients, cohortViewClients);
    changeListType(
      socket,
      dashboardViewClients,
      cohortViewClients,
      listViewClients
    );
    clearVote(socket);
    cloneItem(socket, dashboardViewClients, cohortViewClients);
    deleteItem(socket);
    deleteList(socket, dashboardViewClients, cohortViewClients);
    emitListsOnAddCohortMember(socket, dashboardViewClients);
    emitListsOnRestoreCohort(socket, dashboardViewClients, cohortViewClients);
    emitListsOnRemoveCohortMember(
      socket,
      dashboardViewClients,
      listViewClients
    );
    emitRemoveMemberOnLeaveCohort(socket);
    leaveList(socket);
    removeListsOnArchiveCohort(socket, dashboardViewClients);
    removeListMember(
      socket,
      dashboardViewClients,
      listViewClients,
      cohortViewClients
    );
    removeMemberRoleInList(socket, listViewClients);
    removeOwnerRoleInList(socket, listViewClients);
    restoreItem(socket, dashboardViewClients, cohortViewClients);
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
    createListCohort(socket, dashboardViewClients);
    leaveCohort(socket, allCohortsViewClients);
    removeCohortMember(socket, allCohortsViewClients, cohortViewClients);
    removeOwnerRoleInCohort(socket, cohortViewClients);
    restoreCohort(socket, allCohortsViewClients, cohortViewClients);
    updateCohort(socket, allCohortsViewClients);
    updateCohortHeaderStatus(socket, cohortClientLocks);
  });
};

module.exports = socketListenTo;
