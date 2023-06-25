import { HOST_CONTAINER } from '../constants/host-container.const';

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
export function HostContainer() {
  return HOST_CONTAINER;
}
