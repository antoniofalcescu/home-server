import { SessionDal } from './session-dal';
import { Session } from './types';

export class SessionService {
  private readonly dal: SessionDal;

  constructor() {
    this.dal = new SessionDal();
  }

  public async getSession(): Promise<Session> {
    return this.dal.getSession();
  }

  public async setSession(session: Partial<Session>, expiredAt: number): Promise<void> {
    return this.dal.setSession(session, expiredAt);
  }
}
