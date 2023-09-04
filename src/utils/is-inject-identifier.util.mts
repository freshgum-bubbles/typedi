import { INJECTED_FACTORY } from '../constants/type-stamps.const.mts';
import { InjectedFactory } from '../types/inject-identifier.type.mts';

/** Check if the specified object is an InjectedFactory. */
export function isInjectedFactory(x: object): x is InjectedFactory {
  return (x as any)[INJECTED_FACTORY] === true;
}
