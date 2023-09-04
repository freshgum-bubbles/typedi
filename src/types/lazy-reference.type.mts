import { LAZY_REFERENCE } from '../constants/type-stamps.const.mts';

export interface LazyReference<T> {
  [LAZY_REFERENCE]: true;
  get(): T;
}
