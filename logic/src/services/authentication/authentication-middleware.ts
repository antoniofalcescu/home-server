import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { HTTP_RESPONSE } from '../../common/constants';
import { EnvHelper } from '../../common/helpers';

export function authenticateMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(HTTP_RESPONSE.UNAUTHORIZED.CODE).json({ message: HTTP_RESPONSE.UNAUTHORIZED.MESSAGE });
    return;
  }

  const { JWT_SECRET } = EnvHelper.get();
  const token = authHeader.split(' ')[1]; // "Bearer <token>"

  jwt.verify(token, JWT_SECRET, (error, decoded) => {
    if (error || !decoded) {
      res.status(HTTP_RESPONSE.FORBIDDEN.CODE).json({ message: HTTP_RESPONSE.FORBIDDEN.MESSAGE });
      return;
    }

    (req as unknown as { user: string | JwtPayload }).user = decoded;
    next();
  });
}
