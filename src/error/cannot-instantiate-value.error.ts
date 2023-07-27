import { ServiceIdentifier } from '../types/service-identifier.type';
import { Token } from '../token.class';

/**
 * This exception is thrown when a container is unable to instantiate a value.
 * This could be due to the service missing a factory, value and type.
 * Alternatively, it could be due to invalid dependencies of a service.
 * @public
 * 
 * @group Errors
 */
export class CannotInstantiateValueError extends Error {
  public name = 'CannotInstantiateValueError';

  /** Normalized identifier name used in the error message. */
  private normalizedIdentifier: string = '<UNKNOWN_IDENTIFIER>';

  public get message(): string {
    return (
      `Cannot instantiate the requested value for the "${this.normalizedIdentifier}" identifier. ` +
      `The related metadata doesn't contain a factory or a type to instantiate.`
    );
  }

  constructor(identifier: ServiceIdentifier) {
    super();

    // TODO: Extract this to a helper function and share between this and NotFoundError.
    if (typeof identifier === 'string') {
      this.normalizedIdentifier = identifier;
    } else if (identifier instanceof Token) {
      this.normalizedIdentifier = `Token<${identifier.name || 'UNSET_NAME'}>`;
    } else if (identifier && (identifier.name || identifier.prototype?.name)) {
      this.normalizedIdentifier =
        `MaybeConstructable<${identifier.name}>` ||
        `MaybeConstructable<${(identifier.prototype as { name: string })?.name}>`;
    }
  }
}
