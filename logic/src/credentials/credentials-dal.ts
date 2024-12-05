import Redis from 'ioredis';
import { Storage } from '../common/storage';
import { DalError } from './errors';

export class CredentialsDal {
  public async setCookies(cookies: string, expiredAt: number): Promise<void> {
    try {
      await this._redis.multi().set(this._cookiesKey, cookies).pexpireat(this._cookiesKey, expiredAt).exec();
    } catch (error) {
      throw new DalError((error as Error).message);
    }
  }

  public async getCookies(): Promise<string | null> {
    try {
      return this._redis.get(this._cookiesKey);
    } catch (error) {
      throw new DalError((error as Error).message);
    }
  }

  private get _redis(): Redis {
    return Storage.getInstance().getRedis();
  }

  private get _cookiesKey(): string {
    return 'cookies';
  }
}
