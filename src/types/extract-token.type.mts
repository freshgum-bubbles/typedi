/**
 * @freshgum/typedi <https://github.com/freshgum-bubbles/typedi>
 *
 * @license MIT
 * Copyright (c) 2015-2021 TypeStack
 * Copyright (c) 2023-2024 freshgum (https://github.com/freshgum-bubbles)
 * For a full copy of the license, see the LICENSE file in the root folder.
 */

import { Token } from '../token.class.mjs';

/**
 * Extract the type of a Token.
 *
 * @example
 * ```ts
 * const token = new Token<string>();
 * const value: ExtractToken<typeof token> = "Hello!";
 * ```
 *
 * @remarks
 * This implements <https://github.com/typestack/typedi/pull/1127>.
 */
export type ExtractToken<T> = T extends Token<infer U> ? U : never;
