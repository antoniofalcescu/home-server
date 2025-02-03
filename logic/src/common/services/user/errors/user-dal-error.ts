export class UserDalError extends Error {
  public readonly metadata: Record<string, unknown>;

  constructor(message: string, metadata: Record<string, unknown> = {}) {
    super(message);

    this.name = UserDalError.name;
    this.metadata = metadata;
  }
}
