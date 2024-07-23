/**
 * @freshgum/typedi <https://github.com/freshgum-bubbles/typedi>
 *
 * @license MIT
 * Copyright (c) 2015-2021 TypeStack
 * Copyright (c) 2023-2024 freshgum (https://github.com/freshgum-bubbles)
 * For a full copy of the license, see the LICENSE file in the root folder.
 */

/**
 * Generic type for abstract class definitions.
 *
 * Explanation: This describes a newable Function with a prototype Which is
 * what an abstract class is - no constructor, just the prototype.
 */
export type AbstractConstructable<T> = NewableFunction & { prototype: T };
