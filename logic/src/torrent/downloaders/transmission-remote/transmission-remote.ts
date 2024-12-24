import { spawn } from 'node:child_process';
import { ITorrentDownloader } from '../interfaces';

// TODO: see here if we need async methods and how to impelement http communication (maybe 204 status for actions)
// also see how to integrate getStatus with grep and other methods as well
export class TransmissionRemote implements ITorrentDownloader {
  public async start(torrentPath: string): Promise<void> {
    // TODO: store it in downloads and then another class will have the responsibility to move this file and rename it accordingly based on name/season if show or name if movie
    const cmd = spawn('transmission-remote', [
      '--download-dir',
      '/srv/dev-disk-by-uuid-d23d2653-600a-46dd-b164-9ac0867e4d43/cutie-pie/downloads',
      '-a',
      torrentPath,
    ]);

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

  public async getStatus(): Promise<void> {
    const cmd2 = spawn('transmission-remote', ['-l']);

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
