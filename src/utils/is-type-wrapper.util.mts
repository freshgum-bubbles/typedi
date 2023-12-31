import { TYPE_WRAPPER, TypeWrapperStamp } from '../constants/type-wrapper.const.mjs';
import { TypeWrapper } from '../types/type-wrapper.type.mjs';

export function isTypeWrapper(x: object): x is TypeWrapper {
  return (x as any)[TYPE_WRAPPER] === TypeWrapperStamp.Generic;
}
