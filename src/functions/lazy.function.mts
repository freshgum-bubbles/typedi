import { LAZY_REFERENCE } from '../constants/type-stamps.const.mjs';
import { LazyReference } from '../types/lazy-reference.type.mjs';

/**
 * Create a lazy reference to a value.
 * This is typically used to signal to `@InjectAll` that a reference must
 * not be eagerly loaded, e.g. in the case of cyclic dependencies.
 */
export function Lazy<T>(fn: () => T): LazyReference<T> {
  return { get: () => fn(), [LAZY_REFERENCE]: true };
}
