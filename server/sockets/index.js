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
  archiveItemWS,
  deleteItemWS,
  restoreItemWS,
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

  const cohortsClients = new Map();
  const dashboardClients = new Map();

  ioInstance.on('connection', socket => {
    const {
      request: { user }
    } = socket;
    const userExist = user || false;

    if (!userExist) {
      return;
    }

    socket.on('joinListRoom', room => {
      console.log(room);
      socket.join(room);
    });

    socket.on('leavingListRoom', listId => {
      socket.leave(`cohort-${listId}`);
    });

    socket.on('joinCohortRoom', room => {
      socket.join(room);
    });

    socket.on('leavingCohortRoom', cohortId => {
      socket.leave(`cohort-${cohortId}`);
    });

    socket.on('enterCohortsView', userId => {
      cohortsClients.set(userId, socket.id);
    });

    socket.on('leavingCohortsView', userId => {
      cohortsClients.delete(userId);
    });

    socket.on('enterDashboardView', userId => {
      dashboardClients.set(userId, socket.id);
    });

    socket.on('leavingDashboardView', userId => {
      dashboardClients.delete(userId);
    });

    socket.on('error', () => {
      /* Ignore error.
       * Don't show any information to a user
       * on the client app, because sockets are
       * not the main feature in this app
       */
    });

    addItemToListWS(socket);
    archiveItemWS(socket);
    updateItemState(socket);
    deleteItemWS(socket);
    restoreItemWS(socket);
    updateItemWS(socket);
    addCommentWS(socket);

    addCohortMemberWS(socket, cohortsClients, dashboardClients);
  });
};

module.exports = socketListenTo;
