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
  let typeWrapper!: TypeWrapper;
  const inputType = typeof typeOrIdentifier;

  /** If requested type is explicitly set via a string ID or token, we set it explicitly. */
  if (typeOrIdentifier && (inputType === 'string' || typeOrIdentifier instanceof Token || inputType === 'function')) {
    typeWrapper = {
      [TYPE_WRAPPER]: TypeWrapperStamp.Generic,
      /** We have to use 'as any' casts here due to moving the "typeof" checks to a constant. */
      eagerType: typeOrIdentifier as any
    };
  } else if (inputType === 'object' && isTypeWrapper(typeOrIdentifier as object)) {
    /**
     * Any arguments which are type-wrappers shouldn't be modified; instead, they should
     * be directly passed to the caller.
     * This allows for functions such as {@link Lazy} and {@link TransientRef} to function.
     */
    return typeOrIdentifier as TypeWrapper;
  }

  return typeWrapper;
}
