/**
 * @freshgum/typedi <https://github.com/freshgum-bubbles/typedi>
 *
 * @license MIT
 * Copyright (c) 2015-2021 TypeStack
 * Copyright (c) 2023-2024 freshgum (https://github.com/freshgum-bubbles)
 * For a full copy of the license, see the LICENSE file in the root folder.
 */

import { AbstractConstructable } from './abstract-constructable.type.mjs';
import { Constructable } from './constructable.type.mjs';

/**
 * A type matching any form of constructable.
 */
export type AnyConstructable<T = unknown> = Constructable<T> | AbstractConstructable<T>;
