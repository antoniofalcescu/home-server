import Ajv, { JSONSchemaType, ValidationError } from 'ajv';
import { ValidatorError } from '../../errors';
import { Validator } from '../../interfaces';

export class AjvValidator implements Validator {
  private readonly ajv: Ajv;

  constructor() {
    this.ajv = new Ajv();
  }

  public validate<T>(schema: JSONSchemaType<T>, data: Record<string, unknown>) {
    const validateSchema = this.ajv.compile(schema);
    const isValid = validateSchema(data);

    if (!isValid) {
      const errors = (validateSchema.errors ?? []) as unknown as ValidationError[];
      throw new ValidatorError<ValidationError>(AjvValidator.name, errors);
    }
  }
}
