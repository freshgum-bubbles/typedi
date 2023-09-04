// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ResolutionConstraintFlag } from '../types/resolution-constraint.type.mjs';
import { ServiceIdentifier } from '../types/service-identifier.type.mjs';

/**
 * A descriptor of a service declared as a dependency of another service.
 * @experimental
 *
 * @remarks
 * Currently, this is only used to describe the dependencies of a service
 * to its corresponding factory function.
 *
 * @example
 * ```ts
 * @Service([[AnotherService, Optional()]], {
 *   factory (id, container, dependencies: DependencyDescriptor[]) {
 *     const [anotherService] = dependencies;
 *     assert(anotherService.id === AnotherService);
 *     assert(anotherService.constraints & Optional());
 *   }
 * });
 * ```
 */
export interface DependencyDescriptor<T = unknown> {
  /** The identifier of the declared dependency. */
  id: ServiceIdentifier<T>;

  /**
   * The constraints of the given service, if any.
   *
   * @see {@link ResolutionConstraintFlag}
   */
  constraints?: number;
}
