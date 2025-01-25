import { Container } from '../../../injectable';
import { SERVICE_NAME } from '../../../injectable/constants';
import { SessionService } from '../../../services/session/session-service';
import { Context } from './types';

export class ContextService {
  private readonly sessionService: SessionService;

  constructor() {
    this.sessionService = Container.get<SessionService>(SERVICE_NAME.SESSION);
  }

  public async init(): Promise<Context> {
    const session = await this.sessionService.getSession();
    return {
      session: session,
    };
  }
}
