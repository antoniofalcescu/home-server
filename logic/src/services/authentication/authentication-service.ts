import jwt from 'jsonwebtoken';
import { EnvHelper } from '../../common/helpers';
import { LoggerService } from '../../common/services/logger';
import { UserService } from '../../common/services/user';
import { Container } from '../../injectable';
import { SERVICE_NAME } from '../../injectable/constants';
import { InvalidPasswordError } from './errors';
import { Argon2id, PasswordHashingAlgorithm } from './password-hashing-algorithm';

export class AuthenticationService {
  private readonly loggerService: LoggerService;

  private readonly userService: UserService;

  private readonly passwordHashingAlgorithm: PasswordHashingAlgorithm;

  constructor() {
    this.loggerService = Container.get<LoggerService>(SERVICE_NAME.LOGGER);
    this.userService = Container.get<UserService>(SERVICE_NAME.USER);

    this.passwordHashingAlgorithm = new Argon2id();
  }

  public async login(login: string, password: string): Promise<string> {
    // TODO: more than this need to also forbid users from creating accounts with usernames as emails

    const user = this._isEmail(login)
      ? await this.userService.getUserByEmail(login)
      : await this.userService.getUserByUsername(login);

    const isPasswordValid = await this.passwordHashingAlgorithm.verify(user.password, password);

    if (!isPasswordValid) {
      throw new InvalidPasswordError('Invalid password', { login });
    }

    const { JWT_SECRET } = EnvHelper.get();
    return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
  }

  private _isEmail(input: string): boolean {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return EMAIL_REGEX.test(input);
  }
}
