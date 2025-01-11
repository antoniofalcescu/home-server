import { execSync, spawn } from 'node:child_process';
import { EnvHelper } from '../../../common/helpers';
import { ITorrentDownloader } from '../interfaces';
import { TorrentDataFromBufferBuilder } from './helpers/builders/torrent-data-from-buffer-builder';
import { TorrentData } from './helpers/builders/torrent-data-from-buffer-builder/types';

// TODO: no need for async methods and can replace all methods with either exec or execSync where we return the buffer
export class TransmissionRemote implements ITorrentDownloader {
  private readonly torrentDataFromBufferBuilder: TorrentDataFromBufferBuilder;

  constructor() {
    this.torrentDataFromBufferBuilder = new TorrentDataFromBufferBuilder();
  }

  public async start(torrentPath: string): Promise<void> {
    const { TORRENT_DOWNLOAD_PATH } = EnvHelper.get();
    // TODO: store it in downloads and then another class will have the responsibility to move this file and rename it accordingly based on name/season if show or name if movie
    const cmd = spawn('transmission-remote', ['--download-dir', TORRENT_DOWNLOAD_PATH, '-a', torrentPath]);

    cmd.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    cmd.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    cmd.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
  }

  public getStatusById(torrentId: string): TorrentData {
    const COMMAND_TO_GET_TORRENT_STATUS = `transmission-remote -t ${torrentId} -i`;
    const buffer = execSync(COMMAND_TO_GET_TORRENT_STATUS);
    return this.torrentDataFromBufferBuilder.build(buffer);
  }

  public getStatus(): TorrentData[] {
    const COMMAND_TO_GET_TORRENT_IDS = `transmission-remote -l | awk 'NR>1 {print $1}' | grep -E '^[0-9]+$'`;
    const buffer = execSync(COMMAND_TO_GET_TORRENT_IDS);
    const torrentIds = buffer.toString().trim().split('\n');

    return torrentIds.reduce((acc, torrentId) => {
      acc.push(this.getStatusById(torrentId));
      return acc;
    }, [] as TorrentData[]);
  }

  public async pause(torrentId: string): Promise<void> {
    const cmd2 = spawn('transmission-remote', ['-t', torrentId, '-S']);

    cmd2.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    cmd2.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    cmd2.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
  }

  public async resume(torrentId: string): Promise<void> {
    const cmd2 = spawn('transmission-remote', ['-t', torrentId, '-s']);

    cmd2.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    cmd2.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    cmd2.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
  }

  public async remove(torrentId: string, shouldDelete: boolean): Promise<void> {
    const removeFlag = shouldDelete ? '--remove-and-delete' : '-r';
    const cmd2 = spawn('transmission-remote', ['-t', torrentId, removeFlag]);

    cmd2.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    cmd2.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    cmd2.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
  }
}
