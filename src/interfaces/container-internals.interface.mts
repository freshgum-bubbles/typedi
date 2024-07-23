/**
 * @freshgum/typedi <https://github.com/freshgum-bubbles/typedi>
 *
 * @license MIT
 * Copyright (c) 2015-2021 TypeStack
 * Copyright (c) 2023-2024 freshgum (https://github.com/freshgum-bubbles)
 * For a full copy of the license, see the LICENSE file in the root folder.
 */

import { ContainerInstance } from '../index.mjs';

/**
 * A collection of private methods which are part of {@link ContainerInstance}.
 * This should be kept up-to-date with any internal Container API changes.
 *
 * @internal
 */
export interface ContainerInternals {
  resolveConstrainedIdentifier: ContainerInstance['resolveConstrainedIdentifier'];
}
