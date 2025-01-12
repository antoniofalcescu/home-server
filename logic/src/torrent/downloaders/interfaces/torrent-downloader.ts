import { TorrentData } from '../transmission-remote/helpers/builders/torrent-data-from-buffer-builder/types';

export interface ITorrentDownloader {
  start(torrentPath: string): void;
  resume(torrentIndex: number): void;
  pause(torrentIndex: number): void;
  remove(torrentIndex: number, shouldDelete: boolean): void;
  getStatusByIndex(torrentIndex: number): TorrentData | undefined;
  getStatus(): TorrentData[];
}
