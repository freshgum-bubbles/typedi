import { LAZY_REFERENCE } from '../constants/type-stamps.const';

export interface LazyReference<T> {
  [LAZY_REFERENCE]: true;
  get(): T;
}
