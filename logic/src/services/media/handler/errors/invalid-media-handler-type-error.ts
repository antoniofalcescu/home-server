export class InvalidMediaHandlerTypeError extends Error {
  public readonly metadata: Record<string, unknown>;

  constructor(message: string, metadata: Record<string, unknown> = {}) {
    super(message);

    this.name = InvalidMediaHandlerTypeError.name;
    this.metadata = metadata;
  }
}
