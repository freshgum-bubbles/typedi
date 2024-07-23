/**
 * @freshgum/typedi <https://github.com/freshgum-bubbles/typedi>
 *
 * @license MIT
 * Copyright (c) 2015-2021 TypeStack
 * Copyright (c) 2023-2024 freshgum (https://github.com/freshgum-bubbles)
 * For a full copy of the license, see the LICENSE file in the root folder.
 */

import { TYPE_WRAPPER, TypeWrapperStamp } from '../constants/type-wrapper.const.mjs';
import { TypeWrapper } from '../types/type-wrapper.type.mjs';

export function isTypeWrapper(x: object): x is TypeWrapper {
  return (x as any)[TYPE_WRAPPER] === TypeWrapperStamp.Generic;
}
