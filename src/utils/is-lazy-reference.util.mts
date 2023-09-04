import { LAZY_REFERENCE } from '../constants/type-stamps.const.mts';
import { LazyReference } from '../types/lazy-reference.type.mts';

export function isLazyReference(x: object): x is LazyReference<any> {
  return (x as any)[LAZY_REFERENCE] === true;
}
