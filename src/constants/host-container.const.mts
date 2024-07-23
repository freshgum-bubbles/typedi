/**
 * @freshgum/typedi <https://github.com/freshgum-bubbles/typedi>
 *
 * @license MIT
 * Copyright (c) 2015-2021 TypeStack
 * Copyright (c) 2023-2024 freshgum (https://github.com/freshgum-bubbles)
 * For a full copy of the license, see the LICENSE file in the root folder.
 */

import { ExecutableToken } from '../executable-token.class.mjs';
import { ContainerInstance } from '../container-instance.class.mjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HostContainer } from '../functions/host-container.function.mjs';

class ExecutableTokenHostContainerToken extends ExecutableToken<ContainerInstance> {
  execute(subject: ContainerInstance) {
    return subject;
  }
}

/**
 * A special identifier which can be used to get the container
 * the service is currently being executed under.
 *
 * @example
 * Here is an example:
 * ```ts
 * @Service([
 *   HostContainer()
 * ])
 * class MyService {
 *   constructor (private container: ContainerInstance) { }
 * }
 * ```
 *
 * @see {@link HostContainer}
 */
export const HOST_CONTAINER = new ExecutableTokenHostContainerToken('Host Container');
