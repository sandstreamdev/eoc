class ResponseError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = 'ResponseError';
  }
}

module.exports = ResponseError;
