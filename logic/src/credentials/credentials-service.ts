import playwright from 'playwright';
import { HOUR_IN_MILLISECONDS } from '../common/constants';
import { sleep } from '../common/helpers/utils';
import { Logger } from '../common/logger';
import { TORRENT_PROVIDER_FIELD } from './constants';
import { CredentialsDal } from './credentials-dal';
import { DalError, EnvError } from './errors';
import { Credentials, TorrentCredentials } from './types';

export class CredentialsService {
  private readonly logger: Logger;
  private readonly dal: CredentialsDal;

  constructor() {
    this.logger = new Logger();
    this.dal = new CredentialsDal();
  }

  public async getCredentials(): Promise<Credentials> {
    const torrentCredentials = await this._getTorrentCredentials();
    return {
      torrent: torrentCredentials,
    };
  }

  // TODO: debug credentials wrong
  private async _getTorrentCredentials(): Promise<TorrentCredentials> {
    try {
      const cachedCookies = await this.dal.getCookies();
      if (cachedCookies) {
        // TODO: metric for cache hit
        console.log('cache hit');
        return { cookies: cachedCookies };
      }
    } catch (error) {
      this.logger.error((error as DalError).message, { error });
    }

    let browser;
    try {
      const { TORRENT_PROVIDER_BASE_URL, TORRENT_PROVIDER_USERNAME, TORRENT_PROVIDER_PASSWORD } = this._getEnv();

      browser = await playwright.chromium.launch({ headless: false });
      const page = await browser.newPage();

      await page.goto(TORRENT_PROVIDER_BASE_URL);
      await Promise.all([
        page.getByPlaceholder(TORRENT_PROVIDER_FIELD.USERNAME).fill(TORRENT_PROVIDER_USERNAME),
        page.getByPlaceholder(TORRENT_PROVIDER_FIELD.PASSWORD).fill(TORRENT_PROVIDER_PASSWORD),
      ]);

      await sleep(200);
      await page.getByRole(TORRENT_PROVIDER_FIELD.BUTTON).click();

      const cookies = await page.context().cookies();
      const serializedCookies = cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join(';');

      // TODO: check if login was successful and only in this case store the cookies
      await this.dal.setCookies(serializedCookies, Date.now() + HOUR_IN_MILLISECONDS);
      return { cookies: serializedCookies };
    } catch (error) {
      this.logger.error((error as Error).message, { error });
      throw error;
    } finally {
      // await browser?.close();
    }
  }

  private _getEnv() {
    const { TORRENT_PROVIDER_BASE_URL, TORRENT_PROVIDER_USERNAME, TORRENT_PROVIDER_PASSWORD } = process.env;

    if (!TORRENT_PROVIDER_BASE_URL) {
      throw new EnvError('TORRENT_PROVIDER_BASE_URL undefined in .env file');
    }

    if (!TORRENT_PROVIDER_USERNAME) {
      throw new EnvError('TORRENT_PROVIDER_USERNAME undefined in .env file');
    }

    if (!TORRENT_PROVIDER_PASSWORD) {
      throw new EnvError('TORRENT_PROVIDER_PASSWORD undefined in .env file');
    }

    return {
      TORRENT_PROVIDER_BASE_URL,
      TORRENT_PROVIDER_USERNAME,
      TORRENT_PROVIDER_PASSWORD,
    };
  }
}
