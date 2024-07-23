/**
 * @freshgum/typedi <https://github.com/freshgum-bubbles/typedi>
 *
 * @license MIT
 * Copyright (c) 2015-2021 TypeStack
 * Copyright (c) 2023-2024 freshgum (https://github.com/freshgum-bubbles)
 * For a full copy of the license, see the LICENSE file in the root folder.
 */

export const TYPE_WRAPPER = Symbol('type-wrapper');

/**
 * We make use of a const enum to stamp each {@link TypeWrapper} as it
 * allows us to inline the 0 wherever this enum is referenced.
 * This enum has, and will most likely only have, one member.
 *
 * This gives us the best of both worlds: we get to use a magic value,
 * without hard-coding numbers everywhere.
 */
export const enum TypeWrapperStamp {
  Generic,
}
