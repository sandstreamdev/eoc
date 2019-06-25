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
  addItemToListWS,
  archiveItemWS,
  deleteItemWS,
  restoreItemWS,
  updateItemState
} = require('./list');

const socketListenTo = server => {
  const ioInstance = io(server);

  ioInstance.use(
    passportSocketIo.authorize({
      key: 'connect.sid',
      secret: process.env.EXPRESS_SESSION_KEY,
      store: sessionStore,
      passport,
      cookieParser
    })
  );

  ioInstance.on('connection', socket => {
    const {
      request: { user }
    } = socket;
    const userExist = user || false;

    if (!userExist) {
      return;
    }

    socket.on('joinRoom', room => {
      socket.join(room);
    });

    socket.on('leavingRoom', listId => {
      socket.leave(`list-${listId}`);
    });

    addItemToListWS(socket);
    archiveItemWS(socket);
    updateItemState(socket);
    deleteItemWS(socket);
    restoreItemWS(socket);
  });
};

module.exports = socketListenTo;
