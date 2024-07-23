/**
 * @freshgum/typedi <https://github.com/freshgum-bubbles/typedi>
 *
 * @license MIT
 * Copyright (c) 2015-2021 TypeStack
 * Copyright (c) 2023-2024 freshgum (https://github.com/freshgum-bubbles)
 * For a full copy of the license, see the LICENSE file in the root folder.
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NativeError } from '../constants/minification/native-error.const.mjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ContainerRegistry } from '../container-registry.class.mjs';

/**
 * An error thrown from operations within the {@link ContainerRegistry}.
 *
 * @group Errors
 *
 * @see {@link ContainerRegistry}
 */
export class ContainerRegistryError extends NativeError {
  readonly name = 'ContainerRegistryError';

  constructor(message: string) {
    super(message);
  }
}
