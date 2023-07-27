import { INJECTED_FACTORY } from '../constants/type-stamps.const';
import { InjectedFactory } from '../types/inject-identifier.type';

/**
 * Check if the specified object is an {@link InjectedFactory}. 
 * @private
 */
export function isInjectedFactory(x: object): x is InjectedFactory {
  return (x as any)[INJECTED_FACTORY] === true;
}
