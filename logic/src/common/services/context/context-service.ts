import { Container } from '../../../injectable';
import { SERVICE_NAME } from '../../../injectable/constants';
import { SessionService } from '../../../services/session';
import { UserService } from '../user';
import { Context } from './types';

export class ContextService {
  private readonly sessionService: SessionService;

  private readonly userService: UserService;

  constructor() {
    this.sessionService = Container.get<SessionService>(SERVICE_NAME.SESSION);
    this.userService = Container.get<UserService>(SERVICE_NAME.USER);
  }

  public async init(userId: string): Promise<Context> {
    const [session, user] = await Promise.all([this.sessionService.getSession(), this.userService.getUserById(userId)]);

    return {
      session,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }
}
