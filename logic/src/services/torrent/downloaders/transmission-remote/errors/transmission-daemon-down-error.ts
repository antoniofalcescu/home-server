export class TransmissionDaemonDownError extends Error {
  public readonly metadata: Record<string, unknown>;

  constructor(message: string, metadata: Record<string, unknown> = {}) {
    super(message);

    this.name = TransmissionDaemonDownError.name;
    this.metadata = metadata;
  }
}
