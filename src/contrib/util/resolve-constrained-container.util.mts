/**
 * @freshgum/typedi <https://github.com/freshgum-bubbles/typedi>
 *
 * @license MIT
 * Copyright (c) 2015-2021 TypeStack
 * Copyright (c) 2023-2024 freshgum (https://github.com/freshgum-bubbles)
 * For a full copy of the license, see the LICENSE file in the root folder.
 */

import { NativeError } from '../../constants/minification/native-error.const.mjs';
import { ContainerInstance } from '../../container-instance.class.mjs';
import { ResolutionConstraintFlag } from '../../types/resolution-constraint.type.mjs';

export function resolveConstrainedContainer(constraints: number, baseContainer: ContainerInstance) {
  const hasSkipSelf = constraints & ResolutionConstraintFlag.SkipSelf;
  const { parent } = baseContainer;

  if (hasSkipSelf && !parent) {
    throw NativeError('SkipSelf() cannot be used on a container with no parent.');
  }

  return hasSkipSelf ? (parent as ContainerInstance) : baseContainer;
}
