import { NextFunction, Request, Response } from 'express';
import { Container } from '../../../injectable';
import { SERVICE_NAME } from '../../../injectable/constants';
import { HTTP_RESPONSE } from '../../constants';
import { ValidatorError } from './errors';
import { RequestPart } from './types';
import { ValidatorService } from './validator-service';

export function validatorMiddleware(schema: Record<string, unknown>, part: RequestPart) {
  return (req: Request, res: Response, next: NextFunction) => {
    const validatorService = Container.get<ValidatorService>(SERVICE_NAME.VALIDATOR);

    try {
      validatorService.validate(req, part, schema);
      next();
    } catch (error) {
      if (error instanceof ValidatorError) {
        res.status(HTTP_RESPONSE.BAD_REQUEST.CODE).json({ message: HTTP_RESPONSE.BAD_REQUEST.MESSAGE });
      } else {
        res.status(HTTP_RESPONSE.INTERNAL_SERVER_ERROR.CODE).json({
          message: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.MESSAGE,
        });
      }
    }
  };
}
