import { ServiceIdentifier } from '../index.mjs';
import { InferServiceType } from '../types/infer-service-type.type.mjs';
import { TypeWrapper } from '../types/type-wrapper.type.mjs';
import { forwardRef } from './forward-ref.function.mjs';

/**
 * Create a lazy reference to a value.
 *
 * This is useful in the case of cyclic dependencies, where two `@Service` calls are referencing each other.
 * In this case, the cyclic dependency can be broken by this function.
 *
 * The concept of lazy references should not be confused with lazy values.  The latter defines a reference
 * to a service which is loaded as-required via the use of explicit function calls.
 *
 * @deprecated This function has been replaced by {@link forwardRef}.
 */
export function Lazy<TIdentifier extends ServiceIdentifier, TInstance = InferServiceType<TIdentifier>>(
  fn: () => TIdentifier
): TypeWrapper<TIdentifier, TInstance> {
  return forwardRef(fn);
}
