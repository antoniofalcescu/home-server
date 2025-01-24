import playwright, { Browser } from 'playwright';
import { HOUR_IN_MILLISECONDS } from '../../common/constants';
import { EnvHelper } from '../../common/helpers';
import { LoggerService } from '../../common/services/logger';
import { Container } from '../../injectable';
import { SERVICE_NAME } from '../../injectable/constants';
import { TORRENT_PROVIDER_FIELD } from './constants';
import { CredentialsDal } from './credentials-dal';
import { DalError } from './errors';
import { Credentials, TorrentCredentials } from './types';

export class CredentialsService {
  private readonly loggerService: LoggerService;

  private readonly dal: CredentialsDal;

  // TODO: move this in a separate singleton class
  //  browser needs to stay alive in one single instance for the duration of the server
  //  the session cookie expires if the browser is closed
  //  maybe move this logic automatically on startup instead of a separate request (maybe keep the request to forcefully recreate the browser if problems appear)
  //  or maybe make a cron job or something else to call this getCredentials request from time to time so that the browser gets refreshed (avoid memory leaks in browser that may cause crashes or out of ram porblems)
  //  easiest solution would be to keep this logic encapsulated in this server, create the browser and populate the cookie at startup and then have a setInterval run from 1h to 1h to close and restart the browser and repopulate the cookie
  private browser: Browser | null = null;

  constructor() {
    this.loggerService = Container.get<LoggerService>(SERVICE_NAME.LOGGER);
    this.dal = new CredentialsDal();
  }

  public async getCredentials(): Promise<Credentials> {
    const torrentCredentials = await this._getTorrentCredentials();
    return {
      torrent: torrentCredentials,
    };
  }

  private async _getTorrentCredentials(): Promise<TorrentCredentials> {
    try {
      // if (cachedCookies) {
      //   // TODO: metric for cache hit
      //   console.log('cache hit');
      //   return { cookies: cachedCookies };
      // }
    } catch (error) {
      this.loggerService.error((error as DalError).message, { error });
    }

    const cachedCookies = await this.dal.getCookies();

    if (this.browser) {
      return { cookies: cachedCookies ?? '' };
    }

    try {
      const { TORRENT_PROVIDER_BASE_URL, TORRENT_PROVIDER_USERNAME, TORRENT_PROVIDER_PASSWORD } = EnvHelper.get();

      this.browser = await playwright.chromium.launch({ headless: false });
      const page = await this.browser.newPage();

      await page.goto(TORRENT_PROVIDER_BASE_URL);
      await page.getByPlaceholder(TORRENT_PROVIDER_FIELD.USERNAME).fill(TORRENT_PROVIDER_USERNAME);
      await page.getByPlaceholder(TORRENT_PROVIDER_FIELD.PASSWORD).fill(TORRENT_PROVIDER_PASSWORD);
      await page.getByRole(TORRENT_PROVIDER_FIELD.BUTTON).click();

      const cookies = await page.context().cookies();
      const serializedCookies = cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join(';');

      // TODO: check if login was successful and only in this case store the cookies
      await this.dal.setCookies(serializedCookies, Date.now() + HOUR_IN_MILLISECONDS);
      return { cookies: serializedCookies };
    } catch (error) {
      this.loggerService.error((error as Error).message, { error });
      throw error;
    }
  }
}
