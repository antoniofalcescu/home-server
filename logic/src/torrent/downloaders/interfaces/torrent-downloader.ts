export interface ITorrentDownloader {
  start(torrentPath: string): Promise<void>;
  resume(torrentId: string): Promise<void>;
  pause(torrentId: string): Promise<void>;
  remove(torrentId: string, shouldDelete: boolean): Promise<void>;
  getStatus(): Promise<void>;
}
