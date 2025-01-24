export class InjectableError extends Error {
  public readonly metadata: Record<string, unknown>;

  constructor(message: string, metadata: Record<string, unknown> = {}) {
    super(message);

    this.name = InjectableError.name;
    this.metadata = metadata;
  }
}
