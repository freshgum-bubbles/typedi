import { CannotInstantiateValueError } from './cannot-instantiate-value.error';

/**
 * This exception is thrown when a built-in (Number, String, etc.) is listed as a dependency
 * of a service, but the service declaration is not accompanied by a corresponding factory
 * to construct an instance of the service.
 * @public
 * 
 * @remarks
 * Without explicit checks for the usage of built-in values, the operation would still
 * fail, as the container would not have a reference for built-in types such as Number or String.
 * However, this is a less cryptic variant of what would usually be thrown.
 * 
 * @group Errors
 */
export class CannotInstantiateBuiltInError extends CannotInstantiateValueError {
  get message() {
    return super.message + ` If your service requires built-in or unresolvable types, please use a factory.`;
  }
}
