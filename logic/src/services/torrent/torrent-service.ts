import * as cheerio from 'cheerio';
import * as fs from 'node:fs';
import { EnvHelper } from '../../common/helpers';
import { Context } from '../../common/services/context/types';
import { LoggerService } from '../../common/services/logger';
import { Container } from '../../injectable';
import { SERVICE_NAME } from '../../injectable/constants';
import { DOWNLOAD_ENDPOINT, SEARCH_ENDPOINT, TORRENT_MAPPING } from './constants';
import { ITorrentDownloader } from './downloaders';
import { TransmissionRemote } from './downloaders/transmission-remote';
import { TorrentData } from './downloaders/transmission-remote/helpers/builders/torrent-data-from-buffer-builder/types';
import { TorrentNotFoundError } from './errors';

export class TorrentService {
  private readonly loggerService: LoggerService;

  private readonly torrentDownloader: ITorrentDownloader;

  constructor() {
    this.loggerService = Container.get<LoggerService>(SERVICE_NAME.LOGGER);

    this.torrentDownloader = new TransmissionRemote();
  }

  public async search(context: Context, torrentName: string, searchLimit: number): Promise<string[]> {
    const {
      session: {
        torrent: { cookies },
      },
    } = context;

    const searchResponse = await fetch(
      `${SEARCH_ENDPOINT}?search=${encodeURIComponent(torrentName)}&sort=${TORRENT_MAPPING.SORT.DOWNLOAD}`,
      {
        credentials: 'include',
        headers: {
          Cookie: cookies,
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        },
      }
    );

    const torrentIds = await this._extractTorrentIds(searchResponse, searchLimit);

    if (torrentIds.length === 0) {
      throw new TorrentNotFoundError(`Failed to find torrent for input: ${torrentName}`);
    }

    return torrentIds;
  }

  public async download(context: Context, torrentId: string): Promise<void> {
    const { TORRENT_DOWNLOAD_PATH } = EnvHelper.get();
    const torrentPath = `${TORRENT_DOWNLOAD_PATH}/${torrentId}.torrent`;

    if (!fs.existsSync(torrentPath)) {
      const {
        session: {
          torrent: { cookies },
        },
      } = context;

      const downloadRes = await fetch(`${DOWNLOAD_ENDPOINT}?id=${encodeURIComponent(torrentId)}`, {
        credentials: 'include',
        headers: {
          Cookie: cookies,
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        },
      });

      const buffer = await downloadRes.arrayBuffer();
      const fileArray = new Uint8Array(buffer);

      fs.writeFileSync(torrentPath, fileArray);
    }

    try {
      this.torrentDownloader.start(torrentPath);
    } catch (error) {
      this.loggerService.warn('Failed to download torrent', {
        torrentPath,
        error,
      });

      throw error;
    }
  }

  public resume(torrentIndex: number): void {
    try {
      this.torrentDownloader.resume(torrentIndex);
    } catch (error) {
      this.loggerService.warn('Failed to resume torrent', {
        torrentIndex,
        error,
      });

      throw error;
    }
  }

  public pause(torrentIndex: number): void {
    try {
      this.torrentDownloader.pause(torrentIndex);
    } catch (error) {
      this.loggerService.warn('Failed to resume torrent', {
        torrentIndex,
        error,
      });

      throw error;
    }
  }

  public remove(torrentIndex: number, shouldDelete: boolean): void {
    try {
      this.torrentDownloader.remove(torrentIndex, shouldDelete);
    } catch (error) {
      this.loggerService.warn('Failed to remove torrent', {
        torrentIndex,
        shouldDelete,
        error,
      });

      throw error;
    }
  }

  public getStatus(): TorrentData[] {
    try {
      return this.torrentDownloader.getStatus();
    } catch (error) {
      this.loggerService.warn('Failed to get status for all torrents', { error });

      throw error;
    }
  }

  public getStatusByIndex(torrentIndex: number): TorrentData | undefined {
    try {
      return this.torrentDownloader.getStatusByIndex(torrentIndex);
    } catch (error) {
      this.loggerService.warn('Failed to get status for torrent by index', { torrentIndex, error });

      throw error;
    }
  }

  private async _extractTorrentIds(response: Response, searchLimit: number): Promise<string[]> {
    const torrentIds = new Set<string>();

    const responseAsHtml = await response.text();
    const $ = cheerio.load(responseAsHtml);

    $('.torrentrow a').each((_, element) => {
      if (torrentIds.size === searchLimit) {
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
