import { TYPE_WRAPPER, TypeWrapperStamp } from '../constants/type-wrapper.const';
import { TypeWrapper } from '../types/type-wrapper.type';

export function isTypeWrapper(x: object): x is TypeWrapper {
  return (x as any)[TYPE_WRAPPER] === TypeWrapperStamp.Generic;
}
