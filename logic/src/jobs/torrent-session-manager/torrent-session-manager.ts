import playwright, { Browser, Page } from 'playwright';
import { HOUR_IN_MILLISECONDS } from '../../common/constants';
import { EnvHelper } from '../../common/helpers';
import { LoggerService } from '../../common/services/logger';
import { Container } from '../../injectable';
import { SERVICE_NAME } from '../../injectable/constants';
import { SessionService } from '../../services/session';
import { TORRENT_PROVIDER_FIELD } from '../../services/session/constants';

export class TorrentSessionManager {
  private static instance: TorrentSessionManager | null = null;

  private static intervalId: NodeJS.Timeout | null = null;

  private readonly loggerService: LoggerService;

  private readonly sessionService: SessionService;

  private readonly browser: Browser;

  private readonly page: Page;

  private constructor(browser: Browser, page: Page) {
    this.loggerService = Container.get<LoggerService>(SERVICE_NAME.LOGGER);
    this.sessionService = Container.get<SessionService>(SERVICE_NAME.SESSION);

    this.browser = browser;
    this.page = page;
  }

  public static async start(): Promise<void> {
    await TorrentSessionManager._refreshSession();

    if (TorrentSessionManager.intervalId) {
      console.info('TorrentSessionManager interval already running');
      return;
    }

    TorrentSessionManager.intervalId = setInterval(async () => {
      await TorrentSessionManager._refreshSession();
    }, HOUR_IN_MILLISECONDS);
  }

  public static async stop(): Promise<void> {
    console.info('TorrentSessionManager is stopping...');

    if (TorrentSessionManager.intervalId) {
      clearInterval(TorrentSessionManager.intervalId);
      TorrentSessionManager.intervalId = null;

      if (TorrentSessionManager.instance) {
        await TorrentSessionManager.instance._destroyInstance();
      }
    }

    console.info('TorrentSessionManager stopped');
  }

  private async _destroyInstance(): Promise<void> {
    TorrentSessionManager.instance = null;
    return this.browser.close();
  }

  private static async _refreshSession(): Promise<void> {
    if (TorrentSessionManager.instance) {
      await TorrentSessionManager.instance._destroyInstance();
    }

    const browser = await playwright.chromium.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    });
    const page = await browser.newPage();
    TorrentSessionManager.instance = new TorrentSessionManager(browser, page);

    TorrentSessionManager.instance.loggerService.info('TorrentSessionManager : Refreshing torrent session...');

    await TorrentSessionManager.instance._getAndStoreSession();
  }

  private async _getAndStoreSession(): Promise<void> {
    try {
      const { TORRENT_PROVIDER_BASE_URL, TORRENT_PROVIDER_USERNAME, TORRENT_PROVIDER_PASSWORD } = EnvHelper.get();

      await this.page.goto(TORRENT_PROVIDER_BASE_URL);
      await this.page.getByPlaceholder(TORRENT_PROVIDER_FIELD.USERNAME).fill(TORRENT_PROVIDER_USERNAME);
      await this.page.getByPlaceholder(TORRENT_PROVIDER_FIELD.PASSWORD).fill(TORRENT_PROVIDER_PASSWORD);
      await this.page.getByRole(TORRENT_PROVIDER_FIELD.BUTTON).click();

      const cookies = await this.page.context().cookies();
      const serializedCookies = cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join(';');
      const torrentSession = { cookies: serializedCookies };

      await this.sessionService.setSession({ torrent: torrentSession }, Date.now() + HOUR_IN_MILLISECONDS);
      this.loggerService.info('TorrentSessionManager : Stored torrent session successfully');
    } catch (error) {
      this.loggerService.error((error as Error).message, { error });
      throw error;
    }
  }
}
