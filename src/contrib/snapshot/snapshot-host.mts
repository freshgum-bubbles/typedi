import { ContainerInstance } from '../../container-instance.class.mjs';
import { ServiceIdentifier, ServiceMetadata } from '../../index.mjs';
import { ManyServicesMetadata } from '../../interfaces/many-services-metadata.interface.mjs';
import { ContainerInternals } from '../util/container-internals.util.mjs';
import { ImmutableMap } from './immutable-map.mjs';

/**
 * An implementation of a snapshot mechanism for TypeDI-compatible container implementations.
 *
 * This host allows you to enter periods wherein changes to the container
 * are staged, and they can easily be rolled back at a later date.
 *
 * @example
 * ```ts
 * // Create a new container.
 * const myContainer = Container.ofChild(Symbol());
 *
 * // Create a snapshot host to allow us to create and rollback changes.
 * const snapshotHost = new SnapshotHost(myContainer);
 *
 * // Make some changes to the container outside of a snapshot.
 * const NAME = new Token<string>();
 * const AGE = new Token<number>();
 * myContainer.set({ id: NAME, value: 'Joanna' });
 *
 * // Briefly enter a snapshot period...
 * snapshotHost.beginSnapshot();
 * myContainer.set({ id: NAME, value: 'Roxy' });
 * myContainer.set({ id: AGE, value: 25 });
 * snapshotHost.endSnapshot();
 *
 * myContainer.getOrNull(NAME);
 * // -> 'Joanna'
 *
 * myContainer.getOrNull(AGE);
 * // -> null
 * ```
 *
 * @remarks
 * This class overrides certain properties of the container.
 * Please be aware of this when using it.
 */
export class SnapshotHost {
  /** Whether the container is currently in a snapshot. */
  get isActive() {
    return this.originalMetadataMap !== null;
  }

  /** The container the host is currently managing snapshots for. */
  public readonly container: ContainerInstance;

  /** The container's original {@link ContainerInstance.metadataMap | metadataMap} collection. */
  private originalMetadataMap: null | Map<ServiceIdentifier, ServiceMetadata<unknown>> = null;

  /** The container's original {@link ContainerInstance.multiServiceIds | multiServiceIds} collection. */
  private originalMultiServiceIds: null | Map<ServiceIdentifier, ManyServicesMetadata> = null;

  constructor(container: ContainerInstance) {
    this.container = container;
  }

  /**
   * Enter a snapshot period.
   * If the host is already in a snapshot, this method does nothing.
   *
   * @example
   * ```ts
   * // Create a new container.
   * const myContainer = Container.ofChild(Symbol());
   *
   * // Create a snapshot host to allow us to create and rollback changes.
   * const snapshotHost = new SnapshotHost(myContainer);
   *
   * // Make some changes to the container outside of a snapshot.
   * const NAME = new Token<string>();
   * const AGE = new Token<number>();
   * myContainer.set({ id: NAME, value: 'Joanna' });
   *
   * // Briefly enter a snapshot period...
   * snapshotHost.beginSnapshot();
   * myContainer.set({ id: NAME, value: 'Roxy' });
   * myContainer.set({ id: AGE, value: 25 });
   * snapshotHost.endSnapshot();
   *
   * myContainer.getOrNull(NAME);
   * // -> 'Joanna'
   *
   * myContainer.getOrNull(AGE);
   * // -> null
   * ```
   */
  beginSnapshot() {
    if (this.isActive) {
      return false;
    }

    /** Save references to the original properties so we can restore them later on. */
    const { metadataMap: originalMetadataMap, multiServiceIds: originalMultiServiceIds } = this
      .container as unknown as ContainerInternals;

    this.originalMetadataMap = originalMetadataMap;
    this.originalMultiServiceIds = originalMultiServiceIds;

    const newMetadataMap = new ImmutableMap<ServiceIdentifier, ServiceMetadata<unknown>>(originalMetadataMap);
    const newMultiServiceIds = new ImmutableMap<ServiceIdentifier, ManyServicesMetadata>(originalMultiServiceIds);

    /** Override the container's map with a shadow map.  @see {@link ImmutableMap}. */
    Object.assign(this.container as unknown as ContainerInternals, {
      metadataMap: newMetadataMap,
      multiServiceIds: newMultiServiceIds,
    });
  }

  endSnapshot() {
    if (!this.isActive) {
      return false;
    }

    /** Restore the container's original metadata stores. */
    Object.assign(this.container as unknown as ContainerInternals, {
      metadataMap: this.originalMetadataMap,
      multiServiceIds: this.originalMultiServiceIds,
    });

    /** Setting "originalMetadataMap"" to null implicitly sets "isActive" to null. */
    this.originalMetadataMap = null;
    this.originalMultiServiceIds = null;

    return true;
  }
}
