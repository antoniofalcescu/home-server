export class TorrentNotFoundError extends Error {
  constructor(message: string) {
    super(message);

    this.name = TorrentNotFoundError.name;
  }
}
