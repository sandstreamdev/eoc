const HttpException = require('./HttpException');

class NotFoundException extends HttpException {
  constructor(id) {
    super(404, `Data of list id: ${id} not found.`);
  }
}

module.exports = NotFoundException;
