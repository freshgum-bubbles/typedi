import { ContainerInstance } from '../container-instance.class.mjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HostContainer } from '../functions/host-container.function.mjs';
import { Token } from '../token.class.mjs';

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
export const HOST_CONTAINER = new Token<ContainerInstance>('Host Container');
