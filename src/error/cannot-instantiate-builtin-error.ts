import { CannotInstantiateValueError } from './cannot-instantiate-value.error';

/**
 * Thrown when DI encounters a service depending on a built-in type (Number, String) with no factory.
 * @public
 * 
 * @group Errors
 */
export class CannotInstantiateBuiltInError extends CannotInstantiateValueError {
  get message() {
    return super.message + ` If your service requires built-in or unresolvable types, please use a factory.`;
  }
}
