import { LoggerService } from '../../common/services/logger';
import { Container } from '../../injectable';
import { SERVICE_NAME } from '../../injectable/constants';
import { SessionDal } from './session-dal';
import { Session } from './types';

export class SessionService {
  private readonly loggerService: LoggerService;

  private readonly dal: SessionDal;

  constructor() {
    this.loggerService = Container.get<LoggerService>(SERVICE_NAME.LOGGER);
    this.dal = new SessionDal();
  }

  public async getSession(): Promise<Session> {
    // TODO: refactor this to support hash with multiple key:value pairs
    const cookies = await this.dal.getSession();

    if (!cookies) {
      throw new Error('missing cookies');
    }

    return {
      torrent: { cookies },
    };
  }

  // TODO: refactor this to support hash with multiple key:value pairs
  public async setSession(cookies: string, expiredAt: number): Promise<void> {
    return this.dal.setSession(cookies, expiredAt);
  }
}
