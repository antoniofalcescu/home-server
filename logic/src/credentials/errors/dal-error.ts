export class DalError extends Error {
  constructor(message: string) {
    super(`${DalError.name} :: ${message}`);
    this.name = DalError.name;
  }
}
