export class AuthenticationDalError extends Error {
  public readonly metadata: Record<string, unknown>;

  constructor(message: string, metadata: Record<string, unknown> = {}) {
    super(message);

    this.name = AuthenticationDalError.name;
    this.metadata = metadata;
  }
}
