import { Request } from 'express';
import { Container } from '../../../injectable';
import { SERVICE_NAME } from '../../../injectable/constants';
import { LoggerService } from '../logger';
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

  public validate(req: Request, schema: Record<string, unknown>) {
    try {
      const dataForValidation = this._parseRequestDataForValidation(req);
      this.validator.validate(schema, dataForValidation);
    } catch (error) {
      if (error instanceof ValidatorError) {
        this.loggerService.error('Failed to validate request', {
          class: ValidatorService.name,
          method: this.validate.name,
          endpoint: req.originalUrl,
          error,
        });
      } else {
        this.loggerService.error('Failed to validate request', {
          method: 'ValidatorService.validate',
          endpoint: req.originalUrl,
          error,
        });
      }

      throw error;
    }
  }

  private _parseRequestDataForValidation(req: Request): Record<RequestPart, unknown> {
    const params = Object.fromEntries(
      Object.entries(req.params).map(([key, value]) => [key, isNaN(Number(value)) ? value : Number(value)])
    );

    return {
      params,
      body: req.body,
      query: req.query,
    };
  }
}
