import { TorrentData } from '../transmission-remote/helpers/builders/torrent-data-from-buffer-builder/types';

export interface ITorrentDownloader {
  start(torrentPath: string): void;
  resume(torrentId: string): void;
  pause(torrentId: string): void;
  remove(torrentId: string, shouldDelete: boolean): void;
  getStatusById(torrentId: string): TorrentData;
  getStatus(): TorrentData[];
}
