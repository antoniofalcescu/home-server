import { Request } from 'express';
import { Context } from '../services/context/types';

export type RequestWithContext = Request & {
  context: Context;
};
