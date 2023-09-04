import { LAZY_REFERENCE } from '../constants/type-stamps.const.mjs';
import { LazyReference } from '../types/lazy-reference.type.mjs';

export function isLazyReference(x: object): x is LazyReference<any> {
  return (x as any)[LAZY_REFERENCE] === true;
}
