import * as cheerio from 'cheerio';
import * as fs from 'node:fs';
import { EnvHelper } from '../common/helpers';
import { Context } from '../context/types';
import { DOWNLOAD_ENDPOINT, SEARCH_ENDPOINT, TORRENT_MAPPING } from './constants';
import { ITorrentDownloader } from './downloaders';
import { TransmissionRemote } from './downloaders/transmission-remote';
import { TorrentNotFoundError } from './errors';

export class TorrentService {
  private readonly torrentDownloader: ITorrentDownloader;

  constructor() {
    this.torrentDownloader = new TransmissionRemote();
  }

  public async search(context: Context, name: string): Promise<string[]> {
    const {
      credentials: {
        torrent: { cookies },
      },
    } = context;

    const searchResponse = await fetch(
      `${SEARCH_ENDPOINT}?search=${encodeURIComponent(name)}&sort=${TORRENT_MAPPING.SORT.DOWNLOAD}`,
      {
        credentials: 'include',
        headers: {
          Cookie: cookies,
        },
      }
    );

    const torrentIds = await this._extractTorrentIds(searchResponse);

    if (torrentIds.length === 0) {
      throw new TorrentNotFoundError(`Failed to find torrent for input: ${name}`);
    }

    return torrentIds;
  }

  public async download(context: Context, id: string): Promise<any> {
    const { TORRENT_DOWNLOAD_PATH } = EnvHelper.get();
    const torrentPath = `${TORRENT_DOWNLOAD_PATH}/${id}.torrent`;

    if (fs.existsSync(torrentPath)) {
      console.log('torrent is saved locally');
      await this.torrentDownloader.start(torrentPath);
      return { status: 'cache' };
    }

    const {
      credentials: {
        torrent: { cookies },
      },
    } = context;

    const downloadRes = await fetch(`${DOWNLOAD_ENDPOINT}?id=${encodeURIComponent(id)}`, {
      credentials: 'include',
      headers: {
        Cookie: cookies,
      },
    });

    const buffer = await downloadRes.arrayBuffer();
    const fileArray = new Uint8Array(buffer);

    fs.writeFileSync(torrentPath, fileArray);
    console.log(`Torrent file saved to ${torrentPath}`);
    await this.torrentDownloader.start(torrentPath);
    return {};
  }

  public async getStatus(): Promise<any> {
    const status = this.torrentDownloader.getStatus();
    console.log(status);
    return status;
  }

  public async getStatusById(id: string): Promise<any> {
    const status = this.torrentDownloader.getStatusById(id);
    console.log(status);
    return status;
  }

  public async resume(id: string): Promise<any> {
    await this.torrentDownloader.resume(id);
    return {};
  }

  public async pause(id: string): Promise<any> {
    await this.torrentDownloader.pause(id);
    return {};
  }

  public async remove(id: string, shouldDelete: boolean): Promise<any> {
    await this.torrentDownloader.remove(id, shouldDelete);
    return {};
  }

  private async _extractTorrentIds(response: Response): Promise<string[]> {
    // TODO: make this easier to change - extract it either in body, in .env-helper or somewhere else
    const TORRENT_IDS_LIMIT = 2;
    const torrentIds = new Set<string>();

    const responseAsHtml = await response.text();
    const $ = cheerio.load(responseAsHtml);

    $('.torrentrow a').each((_, element) => {
      if (torrentIds.size === TORRENT_IDS_LIMIT) {
        return;
      }

      const href = $(element).attr('href');
      if (href) {
        const match = href.match(/id=(\d+)/);
        if (match) {
          torrentIds.add(match[1]);
        }
      }
    });

    return Array.from(torrentIds);
  }
}
