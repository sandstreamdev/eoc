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
  changeItemOrderState,
  clearVote,
  cloneItem,
  deleteItem,
  emitListsOnAddCohortMember,
  emitRemoveMemberOnLeaveCohort,
  leaveList,
  removeMember,
  removeMemberRoleInList,
  removeOwnerRoleInList,
  restoreItem,
  setVote,
  updateItem,
  updateItemState,
  updateList,
  updateListHeaderState
} = require('./list');
const {
  addCohortMember,
  addOwnerRoleInCohort,
  leaveCohort,
  removeOwnerRoleInCohort,
  updateCohort,
  updateCohortHeaderStatus
} = require('./cohort');

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

  const cohortViewClients = new Map();
  const allCohortsViewClients = new Map();
  const dashboardViewClients = new Map();
  const listViewClients = new Map();

  ioInstance.on('connection', socket => {
    const {
      request: { user }
    } = socket;
    const userExist = user || false;

    if (!userExist) {
      return;
    }

    socket.on('joinSackRoom', data => {
      const { room, userId } = data;

      socket.join(room);
      listViewClients.set(userId, socket.id);
    });
    socket.on('leaveSackRoom', data => {
      const { room, userId } = data;

      socket.leave(room);
      listViewClients.delete(userId, socket.id);
    });

    socket.on('joinCohortRoom', data => {
      const { room, userId } = data;

      socket.join(room);
      cohortViewClients.set(userId, socket.id);
    });

    socket.on('leaveCohortRoom', data => {
      const { room, userId } = data;

      socket.leave(room);
      cohortViewClients.delete(userId, socket.id);
    });

    socket.on('enterCohortsView', userId =>
      allCohortsViewClients.set(userId, socket.id)
    );

    socket.on('leaveCohortsView', userId =>
      allCohortsViewClients.delete(userId)
    );

    socket.on('enterDashboardView', userId =>
      dashboardViewClients.set(userId, socket.id)
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
    changeItemOrderState(socket, dashboardViewClients);
    clearVote(socket);
    cloneItem(socket);
    deleteItem(socket);
    emitListsOnAddCohortMember(socket, dashboardViewClients);
    emitRemoveMemberOnLeaveCohort(socket);
    leaveList(socket);
    removeMember(socket, listViewClients);
    removeMemberRoleInList(socket, listViewClients);
    removeOwnerRoleInList(socket, listViewClients);
    restoreItem(socket);
    setVote(socket);
    updateItem(socket);
    updateItemState(socket);
    updateList(socket, dashboardViewClients, cohortViewClients);
    updateListHeaderState(socket);

    addCohortMember(socket, allCohortsViewClients);
    addOwnerRoleInCohort(socket, cohortViewClients);
    leaveCohort(socket, allCohortsViewClients);
    removeOwnerRoleInCohort(socket, cohortViewClients);
    updateCohort(socket, allCohortsViewClients);
    updateCohortHeaderStatus(socket);
  });
};

module.exports = socketListenTo;
