import { Request, Response } from 'express';
import { HTTP_RESPONSE } from '../../common/constants';
import { UserNotFoundError } from '../../common/services/user/errors';
import { Container } from '../../injectable';
import { SERVICE_NAME } from '../../injectable/constants';
import { AuthenticationService } from './authentication-service';
import { InvalidPasswordError } from './errors';

export class AuthenticationController {
  public async login(req: Request, res: Response): Promise<void> {
    const {
      body: { login, password },
    } = req;

    const authenticationService = Container.get<AuthenticationService>(SERVICE_NAME.AUTHENTICATION);

    try {
      const token = await authenticationService.login(login, password);

      res.status(HTTP_RESPONSE.OK.CODE).json({
        message: HTTP_RESPONSE.OK.MESSAGE,
        token,
      });
    } catch (error) {
      if (error instanceof UserNotFoundError || error instanceof InvalidPasswordError) {
        res.status(HTTP_RESPONSE.NOT_FOUND.CODE).json({
          message: HTTP_RESPONSE.NOT_FOUND.MESSAGE,
        });
        return;
      }

      res.status(HTTP_RESPONSE.INTERNAL_SERVER_ERROR.CODE).json({
        message: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.MESSAGE,
      });
    }
  }
}
