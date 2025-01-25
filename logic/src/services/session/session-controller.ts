import { Request, Response } from 'express';
import { HTTP_RESPONSE } from '../../common/constants';
import { Container } from '../../injectable';
import { SERVICE_NAME } from '../../injectable/constants';
import { SessionService } from './session-service';

export class SessionController {
  public async getSession(_: Request, res: Response): Promise<void> {
    const sessionService = Container.get<SessionService>(SERVICE_NAME.SESSION);

    try {
      const cookies = await sessionService.getSession();
      console.log(cookies);
      res.status(HTTP_RESPONSE.OK.CODE).json({ message: HTTP_RESPONSE.OK.MESSAGE });
    } catch {
      res.status(HTTP_RESPONSE.INTERNAL_SERVER_ERROR.CODE).json({
        message: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.MESSAGE,
      });
    }
  }
}
