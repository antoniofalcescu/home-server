import Redis from 'ioredis';
import { Storage } from '../../common/storage';
import { DalError } from './errors';
import { Session } from './types';

export class SessionDal {
  public async setSession(session: Partial<Session>, expiredAt: number): Promise<void> {
    try {
      const serializedSession = this._serialize(session);

      const redisMulti = this._redis.multi();

      for (const [key, value] of Object.entries(serializedSession)) {
        redisMulti.hset(this._sessionKey, key, value);
      }

      redisMulti.pexpireat(this._sessionKey, expiredAt);

      await redisMulti.exec();
    } catch (error) {
      throw new DalError((error as Error).message);
    }
  }

  public async getSession(): Promise<Session> {
    try {
      const serializedSession = await this._redis.hgetall(this._sessionKey);
      return this._deserialize(serializedSession);
    } catch (error) {
      throw new DalError((error as Error).message);
    }
  }

  private _serialize(session: Partial<Session>): Record<string, string> {
    return Object.keys(session).reduce(
      (acc, key) => {
        acc[key] = JSON.stringify(session[key as keyof Partial<Session>]);
        return acc;
      },
      {} as Record<string, string>
    );
  }

  private _deserialize(serializedSession: Record<string, string>): Session {
    return Object.keys(serializedSession).reduce((acc, key) => {
      acc[key as keyof Session] = JSON.parse(serializedSession[key]);
      return acc;
    }, {} as Session);
  }

  private get _redis(): Redis {
    return Storage.getInstance().getRedis();
  }

  private get _sessionKey(): string {
    return 'session';
  }
}
