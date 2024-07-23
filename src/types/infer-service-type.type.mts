/**
 * @freshgum/typedi <https://github.com/freshgum-bubbles/typedi>
 *
 * @license MIT
 * Copyright (c) 2015-2021 TypeStack
 * Copyright (c) 2023-2024 freshgum (https://github.com/freshgum-bubbles)
 * For a full copy of the license, see the LICENSE file in the root folder.
 */

import { Token } from '../token.class.mjs';
import { AbstractConstructable } from './abstract-constructable.type.mjs';
import { Constructable } from './constructable.type.mjs';
import { ServiceIdentifier } from './service-identifier.type.mjs';

/**
 * A list of class-based types which are inferrable from usage.
 * @internal
 */
type InferrableType<T> = Constructable<T> | AbstractConstructable<T> | Token<T>;

/**
 * A helper which infers the type of service instances from a given identifier.
 * @internal
 *
 * @remarks
 * This builds on the assumption that class-based identifiers map directly to
 * the type created when the identifier is passed to the container.
 */
export type InferServiceType<T extends ServiceIdentifier> = T extends InferrableType<infer U> ? U : unknown;
