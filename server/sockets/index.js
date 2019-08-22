const io = require('socket.io');
const passportSocketIo = require('passport.socketio');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const cookieParser = require('cookie-parser');

const { SOCKET_TIMEOUT } = require('../common/variables');

const sessionStore = new MongoStore({
  mongooseConnection: mongoose.connection
});

let socketInstance;

module.exports = {
  init: server => {
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
  },
  getInstance: () => {
    if (!socketInstance) {
      throw new Error('Socket not initialized...');
    }

    return socketInstance;
  }
};
