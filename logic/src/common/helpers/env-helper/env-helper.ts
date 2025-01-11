import { ENV_KEYS } from './constants';
import { EnvError } from './errors';
import { Env } from './types';

export class EnvHelper {
  public static verify() {
    // TODO: at the moment ENV_KEYS is manually populated
    //  ideally we should create it dynamically based on the Env type
    for (const key of ENV_KEYS) {
      if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
        throw new EnvError(`Missing key ${key} in .env`);
      }
    }
  }

  public static get(): Env {
    return process.env as Env;
  }
}
