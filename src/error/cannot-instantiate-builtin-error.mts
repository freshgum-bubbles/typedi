import { ServiceIdentifier } from '../index.mjs';
import { CannotInstantiateValueError } from './cannot-instantiate-value.error.mjs';

/**
 * Thrown when DI encounters a service depending on a built-in type (Number, String) with no factory.
 *
 * @group Errors
 */
export class CannotInstantiateBuiltInError extends CannotInstantiateValueError {
  public readonly message =
    super.message + ` If your service requires built-in or unresolvable types, please use a factory.`;

  constructor (identifier: ServiceIdentifier, footer?: string) {
    super(identifier, footer);
  }
}
