/**
 * @freshgum/typedi <https://github.com/freshgum-bubbles/typedi>
 *
 * @license MIT
 * Copyright (c) 2015-2021 TypeStack
 * Copyright (c) 2023-2024 freshgum (https://github.com/freshgum-bubbles)
 * For a full copy of the license, see the LICENSE file in the root folder.
 */

import { Token } from '../token.class.mjs';
import { ServiceIdentifier } from '../types/service-identifier.type.mjs';

export function normalizeIdentifier(identifier: ServiceIdentifier) {
  let name: string;

  return typeof identifier === 'string'
    ? identifier
    : identifier instanceof Token
    ? `Token<${identifier.name ?? 'UNSET_NAME'}>`
    : ((name = identifier?.name ?? identifier.prototype?.name) && `MaybeConstructable<${name}>`) ??
      '<UNKNOWN_IDENTIFIER>';
}
