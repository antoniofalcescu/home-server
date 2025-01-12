import { execSync } from 'node:child_process';
import { EnvHelper } from '../../../common/helpers';
import { ITorrentDownloader } from '../interfaces';
import { TransmissionDaemonDownError, TransmissionRemoteErrorsManager, UnrecognizedTorrentError } from './errors';
import { TorrentDataFromBufferBuilder } from './helpers/builders/torrent-data-from-buffer-builder';
import { TorrentData } from './helpers/builders/torrent-data-from-buffer-builder/types';

// TODO: when transmission-daemon service goes down the torrents in the list get reassigned ids
//  need to either make a way to give custom ids or keep track of ids with a request (can do a getStatus in this case to update the ids)
export class TransmissionRemote implements ITorrentDownloader {
  private readonly torrentDataFromBufferBuilder: TorrentDataFromBufferBuilder;

  constructor() {
    this.torrentDataFromBufferBuilder = new TorrentDataFromBufferBuilder();
  }

  public start(torrentPath: string): void {
    try {
      const { TORRENT_DOWNLOAD_PATH } = EnvHelper.get();
      const DOWNLOAD_TORRENT_CMD = `transmission-remote --download-dir ${TORRENT_DOWNLOAD_PATH} -a ${torrentPath}`;
      execSync(DOWNLOAD_TORRENT_CMD);
    } catch (error) {
      if (error instanceof Error) {
        if (TransmissionRemoteErrorsManager.isUnrecognizedTorrentError(error)) {
          const stdout = (error as unknown as { stdout: Buffer }).stdout;
          const stderr = (error as unknown as { stderr: Buffer }).stderr;

          throw new UnrecognizedTorrentError(error.message, stdout, stderr);
        }

        if (TransmissionRemoteErrorsManager.isTransmissionDaemonDownError(error)) {
          throw new TransmissionDaemonDownError(error.message);
        }

        throw error;
      }
    }
  }

  public pause(torrentIndex: number): void {
    const PAUSE_TORRENT_CMD = `transmission-remote -t ${torrentIndex} -S`;
    execSync(PAUSE_TORRENT_CMD);
  }

  public resume(torrentIndex: number): void {
    const RESUME_TORRENT_CMD = `transmission-remote -t ${torrentIndex} -s`;
    execSync(RESUME_TORRENT_CMD);
  }

  public remove(torrentIndex: number, shouldDelete: boolean): void {
    const removeFlag = shouldDelete ? '--remove-and-delete' : '-r';
    const REMOVE_TORRENT_CMD = `transmission-remote -t ${torrentIndex} ${removeFlag}`;
    execSync(REMOVE_TORRENT_CMD);
  }

  public getStatusByIndex(torrentIndex: number): TorrentData | undefined {
    const GET_TORRENT_STATUS_CMD = `transmission-remote -t ${torrentIndex} -i`;

    const buffer = execSync(GET_TORRENT_STATUS_CMD);
    if (!buffer.length) {
      return;
    }

    return this.torrentDataFromBufferBuilder.build(buffer);
  }

  public getStatus(): TorrentData[] {
    const GET_TORRENT_IDS_CMD = `transmission-remote -l | awk 'NR>1 {print $1}' | grep -E '^[0-9]+$' || true`;

    const buffer = execSync(GET_TORRENT_IDS_CMD);

    if (!buffer.length) {
      return [];
    }

    const torrentIndexes = buffer.toString().trim().split('\n');
    return torrentIndexes.reduce((acc, torrentIndex) => {
      const torrent = this.getStatusByIndex(Number(torrentIndex));
      if (torrent) {
        acc.push(torrent);
      }

      return acc;
    }, [] as TorrentData[]);
  }
}
