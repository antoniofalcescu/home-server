export class ValidatorError extends Error {
  public readonly validatorName: string;
  public readonly metadata: Record<string, unknown>;

  constructor(validatorName: string, metadata: Record<string, unknown> = {}) {
    super('Failed to validate schema');

    this.name = ValidatorError.name;
    this.validatorName = validatorName;
    this.metadata = metadata;
  }
}
