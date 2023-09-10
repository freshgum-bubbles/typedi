import { ServiceIdentifier } from '../types/service-identifier.type';
import { normalizeIdentifier } from '../utils/normalize-identifier.util';

/**
 * Thrown when requested service was not found.
 *
 * @group Errors
 */
export class ServiceNotFoundError extends Error {
  public readonly name = 'ServiceNotFoundError';

  /** Normalized identifier name used in the error message. */
  private readonly normalizedIdentifier: string;

  get message(): string {
    return (
      `Service with "${this.normalizedIdentifier}" identifier was not found in the container. ` +
      `Register it before usage via explicitly calling the "Container.set" function or using the "@Service()" decorator.`
    );
  }

  constructor(identifier: ServiceIdentifier) {
    super();
    this.normalizedIdentifier = normalizeIdentifier(identifier);
  }
}
