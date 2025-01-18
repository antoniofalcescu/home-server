export interface Validator {
  validate(schema: Record<string, unknown>, data: Record<string, unknown>): void;
}
