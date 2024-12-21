import * as cheerio from 'cheerio';
import * as fs from 'node:fs';
import { Context } from '../context/types';
import { DOWNLOAD_ENDPOINT, SEARCH_ENDPOINT, TORRENT_MAPPING } from './constants';
import { TorrentNotFoundError } from './errors';

export class TorrentService {
  public async search(context: Context, name: string): Promise<string[]> {
    const {
      credentials: {
        torrent: { cookies },
      },
    } = context;

    console.log(`${SEARCH_ENDPOINT}?search=${encodeURIComponent(name)}&sort=${TORRENT_MAPPING.SORT.DOWNLOAD}`);

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

    // TODO: continue here with starting the download - doing error handling and maybe do methods for handling the download lifecycle
    // -> stop, resume, get status, remove
    const filePath = `/Users/antonio/Documents/${id}.torrent`;
    fs.writeFileSync(filePath, fileArray);
    console.log(`Torrent file saved to ${filePath}`);
    return {};
    //
    // const cmd = spawn('transmission-remote', ['-a', filePath]);
    //
    // cmd.stdout.on('data', (data) => {
    //   console.log(`stdout: ${data}`);
    // });
    //
    // cmd.stderr.on('data', (data) => {
    //   console.error(`stderr: ${data}`);
    // });
    //
    // cmd.on('close', (code) => {
    //   console.log(`child process exited with code ${code}`);
    // });
    //
    // const cmd2 = spawn('transmission-remote', ['-l']);
    //
    // cmd2.stdout.on('data', (data) => {
    //   console.log(`stdout: ${data}`);
    // });
    //
    // cmd2.stderr.on('data', (data) => {
    //   console.error(`stderr: ${data}`);
    // });
    //
    // cmd2.on('close', (code) => {
    //   console.log(`child process exited with code ${code}`);
    // });

    // ceva.each((index, element) => {
    //   // Get the content of the element
    //   const content = $(element).html();
    //   const idElement = $(element).find('a[href^="details.php?id="]')
    //   const id = idElement?.attr('href')?.split('id=')[1];
    //
    //   // Print the extracted ID
    //   console.log(`Torrent row ${index + 1} - ID: ${id}`);
    //
    //   // Process the content as needed (e.g., extract specific data)
    //   // console.log(`Torrent row ${index + 1}:`, content);
    // });
  }

  private async _extractTorrentIds(response: Response): Promise<string[]> {
    // TODO: make this easier to change - extract it either in body, in .env or somewhere else
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
