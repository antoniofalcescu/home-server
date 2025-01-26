import Redis from 'ioredis';
import { Pool } from 'pg';
import { EnvHelper } from '../helpers';

export class Storage {
  private static instance: Storage | null = null;

  private readonly redis: Redis;

  private readonly postgres: Pool;

  private constructor() {
    const { PG_HOST, PG_PORT, PG_DATABASE, PG_USER, PG_PASSWORD } = EnvHelper.get();

    this.redis = new Redis();
    this.postgres = new Pool({
      host: PG_HOST,
      port: Number(PG_PORT),
      database: PG_DATABASE,
      user: PG_USER,
      password: PG_PASSWORD,
    });
  }

  public static getInstance(): Storage {
    if (!Storage.instance) {
      Storage.instance = new Storage();
    }

    return Storage.instance;
  }

  public getRedis(): Redis {
    return this.redis;
  }

  public getPostgres(): Pool {
    return this.postgres;
  }
}
