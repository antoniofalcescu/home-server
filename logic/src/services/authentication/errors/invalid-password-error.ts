export class InvalidPasswordError extends Error {
  public readonly metadata: Record<string, unknown>;

  constructor(message: string, metadata: Record<string, unknown> = {}) {
    super(message);

    this.name = InvalidPasswordError.name;
    this.metadata = metadata;
  }
}
