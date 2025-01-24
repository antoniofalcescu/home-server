import { Container } from '../../../injectable';
import { SERVICE_NAME } from '../../../injectable/constants';
import { CredentialsService } from '../../../services/credentials/credentials-service';
import { Context } from './types';

export class ContextService {
  private readonly credentialsService: CredentialsService;

  constructor() {
    this.credentialsService = Container.get<CredentialsService>(SERVICE_NAME.CREDENTIALS);
  }

  public async init(): Promise<Context> {
    const credentials = await this.credentialsService.getCredentials();
    return {
      credentials,
    };
  }
}
