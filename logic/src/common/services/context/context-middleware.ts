import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Container } from '../../../injectable';
import { SERVICE_NAME } from '../../../injectable/constants';
import { HTTP_RESPONSE } from '../../constants';
import { ContextService } from './context-service';
import { Context } from './types';

export async function contextMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const contextService = Container.get<ContextService>(SERVICE_NAME.CONTEXT);
  try {
    const {
      user: { id },
    } = req as unknown as { user: JwtPayload };

    (req as unknown as { context: Context }).context = await contextService.init(id);
    next();
  } catch (error) {
    console.log(`Error initializing context: ${error}`);
    res.status(HTTP_RESPONSE.INTERNAL_SERVER_ERROR.CODE).json({
      message: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.MESSAGE,
    });
  }
}
