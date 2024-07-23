/**
 * @freshgum/typedi <https://github.com/freshgum-bubbles/typedi>
 *
 * @license MIT
 * Copyright (c) 2015-2021 TypeStack
 * Copyright (c) 2023-2024 freshgum (https://github.com/freshgum-bubbles)
 * For a full copy of the license, see the LICENSE file in the root folder.
 */

import { HOST_CONTAINER } from '../constants/host-container.const.mjs';
import { ExecutableToken } from '../executable-token.class.mjs';
import { ContainerInstance } from '../index.mjs';

/**
 * A special identifier which can be used to get the container
 * the service is currently being executed under.
 * Optionally, combined with resolution contraints such as SkipSelf,
 * this could be used to attain a reference to parent containers.
 *
 * @example
 * An example of this can be found below:
 * ```ts
 * @Service([
 *   HostContainer()
 * ])
 * export class MyService {
 *   constructor (private container: ContainerInstance) { }
 * }
 * ```
 */
export const HostContainer: { (): ExecutableToken<ContainerInstance> } = () => HOST_CONTAINER;
