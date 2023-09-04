import { Token } from '../token.class.mts';
import { AnyInjectIdentifier } from '../types/inject-identifier.type.mts';
import { LazyReference } from '../types/lazy-reference.type.mts';
import { ServiceIdentifier } from '../types/service-identifier.type.mts';
import { TypeWrapper } from '../types/type-wrapper.type.mts';
import { isInjectedFactory } from './is-inject-identifier.util.mts';
import { isLazyReference } from './is-lazy-reference.util.mts';

/**
 * Helper function used in the injection-related decorators to resolve the received identifier to
 * an eager type when possible or to a lazy type when cyclic dependencies are possibly involved.
 *
 * @param typeOrIdentifier a service identifier or a function returning a type acting as service identifier or nothing
 * @param target the class definition of the target of the decorator
 */
export function resolveToTypeWrapper(typeOrIdentifier: AnyInjectIdentifier): TypeWrapper {
  /**
   * ? We want to error out as soon as possible when looking up services to inject, however
   * ? we cannot determine the type at decorator execution when cyclic dependencies are involved
   * ? because calling the received `() => MyType` function right away would cause a JS error:
   * ? "Cannot access 'MyType' before initialization", so we need to execute the function in the handler,
   * ? when the classes are already created. To overcome this, we use a wrapper:
   * ?  - the lazyType is executed in the handler so we never have a JS error
   * ?  - the eagerType is checked when decorator is running and an error is raised if an unknown type is encountered
   */
  let typeWrapper!: TypeWrapper;
  const inputType = typeof typeOrIdentifier;

  /** If requested type is explicitly set via a string ID or token, we set it explicitly. */
  if (typeOrIdentifier && (inputType === 'string' || inputType === 'function' || typeOrIdentifier instanceof Token)) {
    typeWrapper = {
      eagerType: typeOrIdentifier as ServiceIdentifier,
      lazyType: () => typeOrIdentifier as ServiceIdentifier,
      isFactory: false,
    };
  } else if (typeof typeOrIdentifier === 'object' && isInjectedFactory(typeOrIdentifier)) {
    /** If requested type is an injected factory, we set it explicitly. */
    typeWrapper = { eagerType: null, factory: typeOrIdentifier, isFactory: true };
  } else if (typeOrIdentifier && isLazyReference(typeOrIdentifier as object)) {
    /** If requested type is explicitly set via a LazyReference, we set it explicitly. */
    /** We set eagerType to null, preventing the raising of the CannotInjectValueError in decorators.  */
    typeWrapper = { eagerType: null, lazyType: () => (typeOrIdentifier as LazyReference<any>).get(), isFactory: false };
  }

  return typeWrapper;
}
