import { LAZY_REFERENCE } from '../constants/type-stamps.const';
import { LazyReference } from '../types/lazy-reference.type';

/**
 * Create a lazy reference to a value.
 * @beta
 */
export function Lazy<T>(fn: () => T): LazyReference<T> {
  return { get: () => fn(), [LAZY_REFERENCE]: true };
}
