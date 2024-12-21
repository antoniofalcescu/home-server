import { Request, Response } from 'express';
import { Container } from '../injectable';
import { SERVICE_NAME } from '../injectable/constants';
import { CredentialsService } from './credentials-service';

export class CredentialsController {
  public async getCredentials(_: Request, res: Response): Promise<void> {
    const credentialsService = Container.get<CredentialsService>(SERVICE_NAME.CREDENTIALS);

    try {
      const cookies = await credentialsService.getCredentials();
      console.log(cookies);
      res.sendStatus(200);
    } catch {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
