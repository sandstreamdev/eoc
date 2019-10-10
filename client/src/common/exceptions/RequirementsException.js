export class RequirementsException extends Error {
  constructor(message, data) {
    super(message);
    this.data = data;
  }
}
