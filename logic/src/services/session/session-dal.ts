import Redis from 'ioredis';
import { Storage } from '../../common/storage';
import { DalError } from './errors';

export class SessionDal {
  public async setSession(cookies: string, expiredAt: number): Promise<void> {
    try {
      await this._redis.multi().set(this._sessionKey, cookies).pexpireat(this._sessionKey, expiredAt).exec();
    } catch (error) {
      throw new DalError((error as Error).message);
    }
  }

  public async getSession(): Promise<string | null> {
    try {
      return this._redis.get(this._sessionKey);
    } catch (error) {
      throw new DalError((error as Error).message);
    }
  }

  private get _redis(): Redis {
    return Storage.getInstance().getRedis();
  }

  private get _sessionKey(): string {
    return 'session';
  }
}
