export class ValidatorError<T> extends Error {
  constructor(
    public readonly validatorName: string,
    public readonly errors: T[]
  ) {
    super('Failed to validate schema');

    this.name = ValidatorError.name;
    this.errors = errors;
  }
}
