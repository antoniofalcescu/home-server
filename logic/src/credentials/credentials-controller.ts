import { Request, Response } from 'express';
import { HTTP_RESPONSE } from '../common/constants';
import { Container } from '../injectable';
import { SERVICE_NAME } from '../injectable/constants';
import { CredentialsService } from './credentials-service';

export class CredentialsController {
  public async getCredentials(_: Request, res: Response): Promise<void> {
    const credentialsService = Container.get<CredentialsService>(SERVICE_NAME.CREDENTIALS);

    try {
      const cookies = await credentialsService.getCredentials();
      console.log(cookies);
      res.status(HTTP_RESPONSE.OK.CODE).json({ message: HTTP_RESPONSE.OK.MESSAGE });
    } catch {
      res.status(HTTP_RESPONSE.INTERNAL_SERVER_ERROR.CODE).json({
        message: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.MESSAGE,
      });
    }
  }
}
