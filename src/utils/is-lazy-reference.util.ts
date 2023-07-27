import { LAZY_REFERENCE } from '../constants/type-stamps.const';
import { LazyReference } from '../types/lazy-reference.type';

/**
 * Check if the specified object is a {@link LazyReference}.
 * @private
 */
export function isLazyReference(x: object): x is LazyReference<any> {
  return (x as any)[LAZY_REFERENCE] === true;
}
