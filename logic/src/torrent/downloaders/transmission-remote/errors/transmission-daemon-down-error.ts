export class TransmissionDaemonDownError extends Error {
  constructor(message: string) {
    super(message);

    this.name = TransmissionDaemonDownError.name;
  }
}
