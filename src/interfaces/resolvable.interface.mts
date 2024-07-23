/**
 * @freshgum/typedi <https://github.com/freshgum-bubbles/typedi>
 *
 * @license MIT
 * Copyright (c) 2015-2021 TypeStack
 * Copyright (c) 2023-2024 freshgum (https://github.com/freshgum-bubbles)
 * For a full copy of the license, see the LICENSE file in the root folder.
 */

import { TypeWrapper } from '../types/type-wrapper.type.mjs';

/**
 * An object containing an identifier, possibly with a strict set of constraints,
 * as defined in {@link ResolutionConstraintFlag}.
 */
export interface Resolvable {
  /**
   * The constraints placed upon the resolution process of the dependency.
   * In most cases, this will be a bitmask.
   *
   * @see {@link ResolutionConstraintFlag}.
   */
  constraints?: number;

  /**
   * The type wrapper for this resolvable.
   */
  typeWrapper: TypeWrapper;
}
