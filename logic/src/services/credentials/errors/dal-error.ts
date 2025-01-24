export class DalError extends Error {
  public readonly metadata: Record<string, unknown>;

  constructor(message: string, metadata: Record<string, unknown> = {}) {
    super(message);

    this.name = DalError.name;
    this.metadata = metadata;
  }
}
