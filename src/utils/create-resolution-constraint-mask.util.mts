/**
 * @freshgum/typedi <https://github.com/freshgum-bubbles/typedi>
 *
 * @license MIT
 * Copyright (c) 2015-2021 TypeStack
 * Copyright (c) 2023-2024 freshgum (https://github.com/freshgum-bubbles)
 * For a full copy of the license, see the LICENSE file in the root folder.
 */

import { ResolutionConstraintFlag, ResolutionConstraintsDescriptor } from '../types/resolution-constraint.type.mjs';

/**
 * Construct a resolution constraint bitmask from the provided constraint descriptor.
 *
 * @param descriptor The descriptor containing resolution constraints for a given service.
 *
 * @returns A bitmask containing the options stored in the descriptor.
 */
export function createResolutionConstraintMask(descriptor: ResolutionConstraintsDescriptor) {
  /** Construct an empty mask. */
  let mask = 0b000;

  if (descriptor.many) {
    mask |= ResolutionConstraintFlag.Many;
  }

  if (descriptor.optional) {
    mask |= ResolutionConstraintFlag.Optional;
  }

  if (descriptor.self) {
    mask |= ResolutionConstraintFlag.Self;
  }

  if (descriptor.skipSelf) {
    mask |= ResolutionConstraintFlag.SkipSelf;
  }

  return mask;
}
