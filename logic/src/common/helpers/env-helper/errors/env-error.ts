export class EnvError extends Error {
  constructor(message: string) {
    super(`${EnvError.name} :: ${message}`);
    this.name = EnvError.name;
  }
}
