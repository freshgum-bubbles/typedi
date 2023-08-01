import { TYPE_WRAPPER, TypeWrapperStamp } from '../constants/type-wrapper.const.mjs';
import { Token } from '../token.class.mjs';
import { AnyInjectIdentifier } from '../types/inject-identifier.type.mjs';
import { TypeWrapper } from '../types/type-wrapper.type.mjs';
import { isTypeWrapper } from './is-type-wrapper.util.mjs';

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
  if (
    typeOrIdentifier &&
    (typeof typeOrIdentifier === 'string' ||
      typeOrIdentifier instanceof Token ||
      typeof typeOrIdentifier === 'function')
  ) {
    typeWrapper = { [TYPE_WRAPPER]: TypeWrapperStamp.Generic, eagerType: typeOrIdentifier, lazyType: () => typeOrIdentifier };
  } else if (typeof typeOrIdentifier === 'object' && isTypeWrapper(typeOrIdentifier)) {
    /**
     * Any arguments which are type-wrappers shouldn't be modified; instead, they should
     * be directly passed to the caller.
     * This allows for functions such as {@link Lazy} and {@link TransientRef} to function.
     */
    return typeOrIdentifier;
  }

  return typeWrapper;
}
