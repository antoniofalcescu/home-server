import { hash, Options, verify } from '@node-rs/argon2';
import { EnvHelper } from '../../../../common/helpers';
import { PasswordHashingAlgorithm } from '../interfaces';

const NORMALIZATION_FORM = 'NFKC';

export class Argon2id implements PasswordHashingAlgorithm {
  private readonly memoryCost: number;
  private readonly timeCost: number;
  private readonly secret: Uint8Array;

  constructor(options?: Options) {
    const { ARGON2_MEMORY_COST, ARGON2_TIME_COST, ARGON2_SECRET } = EnvHelper.get();

    this.memoryCost = options?.memoryCost ?? Number(ARGON2_MEMORY_COST);
    this.timeCost = options?.timeCost ?? Number(ARGON2_TIME_COST);
    this.secret = options?.secret ?? Buffer.from(ARGON2_SECRET);
  }

  public async hash(password: string): Promise<string> {
    return await hash(password.normalize(NORMALIZATION_FORM), {
      memoryCost: this.memoryCost,
      timeCost: this.timeCost,
      secret: this.secret,
    });
  }

  public async verify(hash: string, password: string): Promise<boolean> {
    return await verify(hash, password.normalize(NORMALIZATION_FORM), {
      memoryCost: this.memoryCost,
      timeCost: this.timeCost,
      secret: this.secret,
    });
  }
}
