export class UnrecognizedTorrentError extends Error {
  public readonly stdout: string;
  public readonly stderr: string;

  constructor(message: string, stdout: Buffer, stderr: Buffer) {
    super(message);

    this.name = UnrecognizedTorrentError.name;
    this.stdout = stdout.toString();
    this.stderr = stderr.toString();
  }
}
