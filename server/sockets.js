const { addItemToListWS } = require('./sockets/list');

module.exports.listen = io => {
  io.on('connection', socket => {
    const {
      request: { user }
    } = socket;
    const userExist = user || false;

    if (!userExist) {
      return;
    }

    addItemToListWS(socket);
  });
};
