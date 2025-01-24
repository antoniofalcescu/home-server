import { execSync } from 'node:child_process';
import { TransmissionDaemonDownError } from './transmission-daemon-down-error';
import { UnrecognizedTorrentError } from './unrecognized-torrent-error';

export class TransmissionRemoteErrorsManager {
  public static isTransmissionDaemonDownError(error: Error): error is TransmissionDaemonDownError {
    try {
      const result = execSync('ps aux | grep transmission-daemon').toString();
      return result.includes('transmission-daemon');
    } catch {
      return false;
    }
  }

  public static isUnrecognizedTorrentError(error: Error): error is UnrecognizedTorrentError {
    if (!Object.prototype.hasOwnProperty.call(error, 'stdout')) {
      return false;
    }

    const stdoutError = this._extractStdoutError((error as unknown as { stdout: Buffer }).stdout);
    return stdoutError === 'unrecognized info';
  }

  private static _extractStdoutError(stdoutBuffer: Buffer): string | undefined {
    const stdout = stdoutBuffer.toString();

    const match = stdout.match(/Error:\s(.+)/);
    return match ? match[1] : undefined;
  }
}
