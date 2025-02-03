import { UserNotFoundError } from './errors';
import { User } from './types';
import { UserDal } from './user-dal';

export class UserService {
  private readonly userDal: UserDal;

  constructor() {
    this.userDal = new UserDal();
  }

  public async getUserById(id: string): Promise<User> {
    const user = await this.userDal.getUserById(id);

    if (!user) {
      throw new UserNotFoundError('Failed to find user', { input: id });
    }

    return user;
  }

  public async getUserByUsername(username: string): Promise<User> {
    const user = await this.userDal.getUserByUsername(username);

    if (!user) {
      throw new UserNotFoundError('Failed to find user', { input: username });
    }

    return user;
  }

  public async getUserByEmail(email: string): Promise<User> {
    const user = await this.userDal.getUserByEmail(email);

    if (!user) {
      throw new UserNotFoundError('Failed to find user', { input: email });
    }

    return user;
  }
}
