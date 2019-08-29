const HttpException = require('./HttpException');

class ValidationException extends HttpException {
  constructor(message) {
    super(400, message);
  }
}

module.exports = ValidationException;
