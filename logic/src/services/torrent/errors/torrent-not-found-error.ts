export class TorrentNotFoundError extends Error {
  public readonly metadata: Record<string, unknown>;

  constructor(message: string, metadata: Record<string, unknown> = {}) {
    super(message);

    this.name = TorrentNotFoundError.name;
    this.metadata = metadata;
  }
}
