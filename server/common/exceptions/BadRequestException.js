const HttpException = require('./HttpException');

class BadRequestException extends HttpException {
  constructor(message) {
    super(400, message);
  }
}

module.exports = BadRequestException;
