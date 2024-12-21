import { Context } from '../../context/types';

declare global {
  namespace Express {
    interface Request {
      context: Context;
    }
  }
}
