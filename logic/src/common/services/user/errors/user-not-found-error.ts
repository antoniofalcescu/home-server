export class UserNotFoundError extends Error {
  public readonly metadata: Record<string, unknown>;

  constructor(message: string, metadata: Record<string, unknown> = {}) {
    super(message);

    this.name = UserNotFoundError.name;
    this.metadata = metadata;
  }
}
