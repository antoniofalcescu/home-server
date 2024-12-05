import Redis from 'ioredis';

export class Storage {
  private static instance: Storage | null = null;
  private readonly redis: Redis;

  private constructor() {
    this.redis = new Redis();
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
}
