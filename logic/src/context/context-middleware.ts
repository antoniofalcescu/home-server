import { NextFunction, Request, Response } from 'express';
import { Container } from '../injectable';
import { SERVICE_NAME } from '../injectable/constants';
import { ContextService } from './context-service';

export async function contextMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const contextService = Container.get<ContextService>(SERVICE_NAME.CONTEXT);
  try {
    req.context = await contextService.init();
    next();
  } catch (error) {
    console.log(`Error initializing context: ${error}`);
    res.status(500).json({ message: 'Internal server error' });
  }
}
