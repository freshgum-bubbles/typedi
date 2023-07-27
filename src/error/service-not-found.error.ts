import { ServiceIdentifier } from '../types/service-identifier.type';
import { Token } from '../token.class';

/**
 * Thrown when a container could not find the requested service.
 * @public
 * 
 * @example
 * Here is an example:
 * ```ts
 * const unknownToken = new Token<string>();
 * Container.get(unknownToken);
 * // A ServiceNotFoundError was thrown.
 * ```
 *
 * @group Errors
 */
export class ServiceNotFoundError extends Error {
  public name = 'ServiceNotFoundError';

  /** Normalized identifier name used in the error message. */
  private normalizedIdentifier: string = '<UNKNOWN_IDENTIFIER>';

  get message(): string {
    return (
      `Service with "${this.normalizedIdentifier}" identifier was not found in the container. ` +
      `Register it before usage via explicitly calling the "Container.set" function or using the "@Service()" decorator.`
    );
  }

  constructor(identifier: ServiceIdentifier) {
    super();

    if (typeof identifier === 'string') {
      this.normalizedIdentifier = identifier;
    } else if (identifier instanceof Token) {
      this.normalizedIdentifier = `Token<${identifier.name || 'UNSET_NAME'}>`;
    } else if (identifier && (identifier.name || identifier.prototype?.name)) {
      this.normalizedIdentifier = `MaybeConstructable<${
        identifier.name ?? (identifier.prototype as { name: string })?.name
      }>`;
    }
  }
}
