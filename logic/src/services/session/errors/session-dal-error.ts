export class SessionDalError extends Error {
  public readonly metadata: Record<string, unknown>;

  constructor(message: string, metadata: Record<string, unknown> = {}) {
    super(message);

    this.name = SessionDalError.name;
    this.metadata = metadata;
  }
}
