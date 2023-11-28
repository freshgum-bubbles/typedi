import { NativeNull } from '../../../constants/minification/native-null.const.mjs';
import { ContainerScope, ResolutionConstraintFlag, ServiceIdentifierLocation, type ContainerInstance, type ServiceIdentifier } from '../../../index.mjs';
import type { ContainerInternals } from '../../../interfaces/container-internals.interface.mjs';
import type { InferServiceType } from '../../../types/infer-service-type.type.mjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { LazyRefHost } from '../../lazy-ref/lazy-ref-host.class.mjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TransientRefHost } from '../../transient-ref/transient-ref-host.class.mjs';
import { resolveConstrainedContainer } from '../resolve-constrained-container.util.mjs';

/**
 * A descriptor of the status of an identifier.
 * The `isMany` element describes whether the identifier was set using the `{ multiple: true }` flag.
 */
export type IDStatus =
  | [isMany: false, scope: ContainerScope]
  | [isMany: true, scope: null];

/**
 * A basic description of an interface which hosts a reference to an identifier
 * within a container.
 *
 * @remarks
 * This is used to reduce code duplication between {@link TransientRefHost}
 * and {@link LazyRefHost}.
 */
export abstract class RefHost<TIdentifier extends ServiceIdentifier, TInstance = InferServiceType<TIdentifier>> {
  /**
   * The container from which to attain individual transient services.
   * @internal
   */
  protected readonly abstract container: ContainerInstance;

  /**
   * The constraints to use when resolving the specified identifier.
   * @internal
   */
  protected readonly abstract constraints: number;

  /**
   * The identifier of the service to attain from the specified container.
   * @internal
   *
   * @remarks
   * This identifier should always result in the creation of a new transient service.
   * No checks are done to ensure this.
   */
  protected abstract accessor id: TIdentifier;

  /**
   * Resolve the identifier in the context of the attached container.
   *
   * @param constraintMask An optional mask to supply.
   * If a mask is supplied, it is applied via Bitwise OR to the default set of constraints.
   *
   * @returns The resolved value of the identifier with the applied constraints.
   */
  protected resolve(constraintMask = 0): TInstance {
    /** Use the same hack in the constructor to access the private class member. */
    return (this.container as unknown as ContainerInternals).resolveConstrainedIdentifier(
      this.id,
      this.constraints | constraintMask
    ) as TInstance;
  }

  /**
   * Attain basic, abstract information about the identifier associated with this host,
   * or `null` if it is not present within the host's container.
   * @internal
   *
   * @remarks
   * The signature of this member **should not be relied-upon by outside consumers**.
   * It will probably change; please do not consider it stable.
   * You Have Been Warned(tm).
   */
  protected getIDStatus (): IDStatus | null {
     /**
     * We need to grab a reference to the identifier in the container's internal metadata map
     * to do a few checks, such as whether the identifier exists, and whether it's transient.
     *
     * We *could* use square-bracket notation at runtime here, but we don't to save bytes in the bundle.
     */
     const { id, constraints, container } = this;

     /**
      * Figure out the container, taking the host's constraints into account.
      * This is only useful for {@link SkipSelf}, as that requires a jump to the
      * container's parent.
      */
     const targetContainer = resolveConstrainedContainer(constraints, container);
     const { metadataMap } = targetContainer as unknown as ContainerInternals;
     const isManyConstrained = !(this.constraints & ResolutionConstraintFlag.Many);
     let isServiceFound: boolean;

     if (isManyConstrained) {
       const [location] = (targetContainer as unknown as ContainerInternals).resolveMultiID(id);
       isServiceFound = location !== ServiceIdentifierLocation.None;
     } else {
       isServiceFound = metadataMap.has(id);
     }

     /** We don't have any metadata to present, so we return `null`. */
     if (!isServiceFound) {
       return null;
     }

     let scope: ContainerScope | null = NativeNull;

     if (!isManyConstrained) {
       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
       scope = metadataMap.get(id)!.scope;
     }

     // Cast required due to us not explicitly checking whether we're using Many,
     // while also passing a scope which could either be null or a ContainerScope.
     return [isManyConstrained, scope] as IDStatus;
  }

  // These docs are here for completeness but ideally all consumers should provide their own.
  /** @returns An instance of the identifier held within the {@link RefHost}. */
  public abstract create(): TInstance;

  /** @returns An instance of the identifier held within the {@link RefHost}, or `null`. */
  public abstract createOrNull(): TInstance | null;
}
