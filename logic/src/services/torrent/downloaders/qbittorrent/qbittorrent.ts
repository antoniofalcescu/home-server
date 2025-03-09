import { ITorrentDownloader } from '../interfaces';
import { TorrentData } from '../transmission-remote/helpers/builders/torrent-data-from-buffer-builder/types';

// TODO: implement this and change the interface
//  manually test the download request directly to qBitTorrent API
/**
 * https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-4.1)#get-torrent-list
 */
export class QBitTorrent implements ITorrentDownloader {
  public start(torrentPath: string): void {
    console.log(torrentPath);
  }

  public pause(torrentIndex: number): void {
    console.log(torrentIndex);
  }

  public resume(torrentIndex: number): void {
    console.log(torrentIndex);
  }

  public remove(torrentIndex: number, shouldDelete: boolean): void {
    console.log(torrentIndex, shouldDelete);
  }

  public getStatus(): TorrentData[] {
    return [];
  }

  public getStatusByIndex(torrentIndex: number): TorrentData | undefined {
    console.log(torrentIndex);
    return undefined;
  }
}
