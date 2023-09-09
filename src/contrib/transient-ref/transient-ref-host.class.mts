import { ContainerInstance } from "../../container-instance.class.mjs";
import { ServiceNotFoundError } from "../../error/service-not-found.error.mjs";
import { ServiceMetadata } from "../../interfaces/service-metadata.interface.mjs";
import { InferServiceType } from "../../types/infer-service-type.type.mjs";
import { ServiceIdentifier } from "../../types/service-identifier.type.mjs";

/**
 * A helper object for managing instances of transient services.
 * This class is internally used by TypeDI to handle {@link TransientRef} dependencies.
 *
 * @remarks
 * In most cases, you won't need to use this class directly.
 * Transient reference hosts can be specified as service dependencies with {@link TransientRef}.
 *
 * @remarks
 * Once a transient service is created, the caller is responsible for managing its lifetime.
 * If its originating container is disposed, any stored instances will still be available.
 * Once added to the official specification, it may be wise to make use of the TC39
 * [Explicit Resource Management](https://github.com/tc39/proposal-explicit-resource-management) proposal.
 * As an example...
 * ```ts
 * @Service({ scope: 'transient' }, [])
 * class MyTransientService {
 *   [Symbol.dispose]() { }
 * }
 *
 * // Create a transient host.
 * const ref = new TransientRefHost(MyTransientService, defaultContainer);
 *
 * function doSomething () {
 *   using service = ref.get(MyTransientService);
 *   // ...
 * }
 * ```
 *
 * @typeParam TIdentifier - The identifier of the service to search for within the container.
 *
 * @typeParam TInstance - The type of each newly-created transient service instance.
 * By default, this is set to infer instance types from the provided service identifier.
 * If the identifier is class-based, the host assumes the type of each instance will be
 * of the class specified as the identifier.
 * _Note that this is an unsafe cast_; the value returned by the container may not be of the expected type.
 *
 * @see {@link TransientRef}
 */
export class TransientRefHost<TIdentifier extends ServiceIdentifier, TInstance = InferServiceType<TIdentifier>> {
  /**
   * The identifier of the service to attain from the specified container.
   * @internal
   *
   * @remarks
   * This identifier should always result in the creation of a new transient service.
   * No checks are done to ensure this.
   */
  protected id: TIdentifier;

  /**
   * The container from which to attain individual transient services.
   * @internal
   */
  protected container: ContainerInstance;

  /**
   * The constraints to use when resolving the specified identifier.
   * @internal
   */
  protected constraints: number;

  /**
   * Create an instance of a {@link TransientRefInstance}.
   * @internal
   */
  public constructor(id: TIdentifier, container: ContainerInstance, constraints: number) {
    this.id = id;
    this.container = container;
    this.constraints = constraints;

    /** 
     * We need to grab a reference to the identifier in the container's internal metadata map
     * to do a few checks, such as whether the identifier exists, and whether it's transient.
     * 
     * We *could* use square-bracket notation at runtime here, but we don't to save bytes in the bundle.
     */
    const { metadataMap } = container as unknown as { metadataMap: ContainerInstance['metadataMap'] };

    /**
     * The {@link TransientRef} function does not ensure that the identifier exists.
     * 
     * To simplify the implementation and ensure this check is performed from potential future call-sites,
     * we do it here instead.
     */
    if (!metadataMap.has(id)) {
      throw new ServiceNotFoundError(id);
    }

    /**
     * The implementation throws in the case of a non-transient identifier being bound as not
     * doing so may cause confusion for end-users, e.g. if they're expecting *every* value from here
     * to be unique, and they've mistakenly bound it to an identifier with non-transient metadata.
     * 
     * In theory, they *could* instantiate this, remove the identifier, and re-bind it to
     * non-transient metadata -- however, this seems like a very rare edge-case.
     */
    if ((metadataMap.get(id) as unknown as ServiceMetadata<unknown>).scope !== 'transient') {
      throw new Error('The provided identifier was not bound to a transient service.');
    }
  }

  /**
   * Create a new instance of the transient service attached to this reference.
   * @public
   *
   * @remarks
   * Once a transient service is created, the caller is responsible for managing its lifetime.
   * If its originating container is disposed, any stored instances will still be available.
   * See the documentation in {@link TransientRefHost} for more examples and a solution.
   *
   * @example
   * Here is an example:
   * ```ts
   * @Service({ scope: 'transient' }, [])
   * class MyTransientService { }
   *
   * // The instance should be created by TypeDI, as this class is protected.
   * const ref = new TransientRefHost(MyTransientService, defaultContainer);
   *
   * // Each call results in a new instance of the transient service.
   * const first = ref.create();
   * const second = ref.create();
   * const third = ref.create();
   * ```
   *
   * @see {@link ContainerInstance.get}
   *
   * @throws Error
   * This exception is thrown if the container cannot find the specified ID.
   * For a variant which instead returns null if the ID cannot be found, use {@link TransientRefHost.createOrNull}.
   */
  create(): TInstance {
    return this.container.get(this.id) as TInstance;
  }

  /**
   * A variant of {@link TransientRefHost.create} which may return null if the
   * identifier does not exist within the given container.
   *
   * @remarks
   * Once a transient service is created, the caller is responsible for managing its lifetime.
   * If its originating container is disposed, any stored instances will still be available.
   * See the documentation in {@link TransientRefHost} for more examples and a solution.
   *
   * @see {@link ContainerInstance.getOrNull}
   *
   * @returns
   * Either an instance of the given identifier, or null.
   * For a variant which throws an error if the ID cannot be found, use {@link TransientRefHost.create}.
   */
  createOrNull(): TInstance | null {
    return this.container.getOrNull(this.id) as TInstance;
  }
}
