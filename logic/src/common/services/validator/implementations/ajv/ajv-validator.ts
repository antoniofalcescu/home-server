import Ajv from 'ajv';
import { ValidatorError } from '../../errors';
import { Validator } from '../../interfaces';
import { RequestPart } from '../../types';

export class AjvValidator implements Validator {
  private readonly ajv: Ajv;

  constructor() {
    this.ajv = new Ajv();
  }

  public validate(schema: Record<string, unknown>, data: Record<RequestPart, unknown>) {
    const validateSchema = this.ajv.compile(schema);
    const isValid = validateSchema(data);

    if (!isValid) {
      throw new ValidatorError(AjvValidator.name, { errors: validateSchema.errors });
    }
  }
}
