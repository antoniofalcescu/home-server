export class UnrecognizedTorrentError extends Error {
  public readonly metadata: Record<string, unknown>;

  constructor(message: string, metadata: Record<string, unknown> = {}) {
    super(message);

    this.name = UnrecognizedTorrentError.name;
    this.metadata = metadata;
  }
}
