import { Context } from '../services/context/types';

declare global {
  namespace Express {
    interface Request {
      context: Context;
    }
  }
}
