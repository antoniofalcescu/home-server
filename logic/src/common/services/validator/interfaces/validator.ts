import { RequestPart } from '../types';

export interface Validator {
  validate(schema: Record<string, unknown>, data: Record<RequestPart, unknown>): void;
}
