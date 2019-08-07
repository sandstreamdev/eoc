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

const socketListenTo = server => {
  const ioInstance = io(server, { forceNew: true, pingTimeout: 60000 });

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
    addListMember(socket, dashboardViewClients, cohortViewClients);
    addMemberRoleInList(socket, listViewClients);
    addOwnerRoleInList(socket, listViewClients);
    archiveItem(socket);
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
    cloneItem(socket);
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
