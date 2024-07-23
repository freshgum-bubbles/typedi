/**
 * @freshgum/typedi <https://github.com/freshgum-bubbles/typedi>
 *
 * @license MIT
 * Copyright (c) 2015-2021 TypeStack
 * Copyright (c) 2023-2024 freshgum (https://github.com/freshgum-bubbles)
 * For a full copy of the license, see the LICENSE file in the root folder.
 */

import { Token } from '../token.class.mjs';
import { Constructable } from './constructable.type.mjs';
import { AbstractConstructable } from './abstract-constructable.type.mjs';

/**
 * Unique service identifier.
 * Can be some class type, or string id, or instance of Token.
 */
export type ServiceIdentifier<T = unknown> =
  | Constructable<T>
  | AbstractConstructable<T>
  | CallableFunction
  | Token<T>
  | string;
