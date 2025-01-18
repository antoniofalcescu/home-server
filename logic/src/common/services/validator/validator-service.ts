import { Request } from 'express';
import { Container } from '../../../injectable';
import { SERVICE_NAME } from '../../../injectable/constants';
import { LoggerService } from '../../../logger';
import { REQUEST_PARTS } from './constants';
import { ValidatorError } from './errors';
import { AjvValidator } from './implementations/ajv';
import { Validator } from './interfaces';
import { RequestPart } from './types';

export class ValidatorService {
  private readonly loggerService: LoggerService;

  private readonly validator: Validator;

  constructor() {
    this.loggerService = Container.get<LoggerService>(SERVICE_NAME.LOGGER);
    this.validator = new AjvValidator();
  }

  public validate(req: Request, part: RequestPart, schema: Record<string, unknown>) {
    try {
      const dataForValidation = this._parseRequestDataForValidation(req, part);
      this.validator.validate(schema, dataForValidation);
    } catch (error) {
      if (error instanceof ValidatorError) {
        // TODO: alert counter
        // TODO: maybe log after implementing rate limiter
      } else {
        this.loggerService.error('Failed to validate request', {
          method: 'ValidatorService.validate',
          endpoint: req.originalUrl,
          part,
          error,
        });
      }

      throw error;
    }
  }

  private _parseRequestDataForValidation(req: Request, part: RequestPart): Record<string, unknown> {
    let data = req[part];

    if (part === REQUEST_PARTS.PARAMS) {
      data = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, isNaN(Number(value)) ? value : Number(value)])
      );
    }

    return data;
  }
}
