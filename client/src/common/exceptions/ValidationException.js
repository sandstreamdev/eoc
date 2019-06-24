export class ValidationException extends Error {
  constructor(message, errors) {
    super(message);
    this.errors = errors;
  }
}
