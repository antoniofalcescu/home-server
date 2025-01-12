import playwright from 'playwright';
import { HOUR_IN_MILLISECONDS } from '../common/constants';
import { EnvHelper } from '../common/helpers';
import { Container } from '../injectable';
import { SERVICE_NAME } from '../injectable/constants';
import { LoggerService } from '../logger';
import { TORRENT_PROVIDER_FIELD } from './constants';
import { CredentialsDal } from './credentials-dal';
import { DalError } from './errors';
import { Credentials, TorrentCredentials } from './types';

export class CredentialsService {
  private readonly loggerService: LoggerService;

  private readonly dal: CredentialsDal;

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
      const cachedCookies = await this.dal.getCookies();
      if (cachedCookies) {
        // TODO: metric for cache hit
        console.log('cache hit');
        return { cookies: cachedCookies };
      }
    } catch (error) {
      this.loggerService.error((error as DalError).message, { error });
    }

    let browser;
    try {
      const { TORRENT_PROVIDER_BASE_URL, TORRENT_PROVIDER_USERNAME, TORRENT_PROVIDER_PASSWORD } = EnvHelper.get();

      browser = await playwright.chromium.launch({ headless: true });
      const page = await browser.newPage();

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
    } finally {
      await browser?.close();
    }
  }
}
