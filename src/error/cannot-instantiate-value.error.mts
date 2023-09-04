import { ServiceIdentifier } from '../types/service-identifier.type.mjs';
import { normalizeIdentifier } from '../utils/normalize-identifier.util.mjs';

/**
 * Thrown when DI cannot inject value into property decorated by `@Inject` decorator.
 *
 * @group Errors
 */
export class CannotInstantiateValueError extends Error {
  public readonly name = 'CannotInstantiateValueError';

  /** Normalized identifier name used in the error message. */
  private readonly normalizedIdentifier: string;

  public get message(): string {
    return (
      `Cannot instantiate the requested value for the "${this.normalizedIdentifier}" identifier. ` +
      `The related metadata doesn't contain a factory or a type to instantiate.`
    );
  }

  constructor(identifier: ServiceIdentifier) {
    super();
    this.normalizedIdentifier = normalizeIdentifier(identifier);
  }
}
