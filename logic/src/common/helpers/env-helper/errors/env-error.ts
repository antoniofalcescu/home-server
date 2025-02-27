export class EnvError extends Error {
  public readonly metadata: Record<string, unknown>;

  constructor(message: string, metadata: Record<string, unknown> = {}) {
    super(message);

    this.name = EnvError.name;
    this.metadata = metadata;
  }
}
