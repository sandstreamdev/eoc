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
  addCommentWS,
  addItemToListWS,
  addListMemberWS,
  archiveItemWS,
  deleteItemWS,
  restoreItemWS,
  sendListsOnAddCohortMember,
  updateItemState,
  updateItemWS
} = require('./list');
const { addCohortMemberWS } = require('./cohort');

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

  ioInstance.on('connection', socket => {
    const {
      request: { user }
    } = socket;
    const userExist = user || false;

    if (!userExist) {
      return;
    }

    socket.on('joinSackRoom', data => {
      const { room } = data;

      socket.join(room);
    });

    socket.on('leaveSackRoom', data => {
      const { room } = data;

      socket.leave(room);
    });

    socket.on('joinCohortRoom', data => {
      const { room, userId } = data;

      socket.join(room);
      cohortViewClients.set(userId, socket.id);
    });

    socket.on('leaveCohortRoom', data => {
      const { room, userId } = data;

      socket.leave(room);
      cohortViewClients.set(userId, socket.id);
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

    addItemToListWS(socket);
    addListMemberWS(socket, dashboardViewClients, cohortViewClients);
    archiveItemWS(socket);
    updateItemState(socket);
    deleteItemWS(socket);
    restoreItemWS(socket);
    updateItemWS(socket);
    addCommentWS(socket);
    sendListsOnAddCohortMember(socket, dashboardViewClients);

    addCohortMemberWS(socket, allCohortsViewClients);
  });
};

module.exports = socketListenTo;
