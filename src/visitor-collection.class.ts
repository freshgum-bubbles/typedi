import { ContainerInstance, defaultContainer } from './container-instance.class';
import { ServiceMetadata } from './interfaces/service-metadata.interface';
import { ContainerTreeVisitor, VisitRetrievalOptions } from './interfaces/tree-visitor.interface';
import { Disposable } from './types/disposable.type';
import { ServiceIdentifier } from './types/service-identifier.type';

/**
 * A collection of individual visitor objects, combined into a collection.
 * This class implements the {@link ContainerTreeVisitor} interface
 * (modulo {@link ContainerTreeVisitor.visitContainer}).
 *
 * When an event is dispatched upon the collection, all attached
 * visitors will be notified in the order in which they were
 * added to the collection.
 * @experimental
 *
 * @example
 * ```ts
 * const collection = new VisitorCollection();
 *
 * // Add our visitor to the collection.
 * collection.addVisitor(new MyVisitor());
 *
 * // Dispatch an event onto the collection,
 * // which will be broadcast to all attached visitors.
 * collection.visitChildContainer(Container.ofChild('hello'));
 * ```
 *
 * @group Tree Visitors
 */
export class VisitorCollection implements Disposable, Omit<ContainerTreeVisitor, 'visitContainer'> {
  /** Whether the instance is disposed. */
  public disposed = false;

  /** The visitors stored within the collection. */
  protected visitors: ContainerTreeVisitor[] = [];

  /**
   * A flag stating whether any visitors are currently present in the collection.
   * If not, all notifications will be ignored.
   *
   * This is mostly for optimisation.
   */
  protected anyVisitorsPresent = false;

  /**
   * A flag which states whether any visitors should be notified.
   * If the collection has been disposed or no visitors are present,
   * this evaluates to `false`.
   */
  protected get notifyVisitors() {
    return !this.disposed && this.anyVisitorsPresent;
  }

  /**
   * Iterate the list of visitors, excluding any which have been disposed.
   * Does not perform any iteration if no visitors are present.
   *
   * @param callback A function to call for each visitor in the collection.
   */
  public forEach(callback: { (visitor: ContainerTreeVisitor): void }) {
    if (this.notifyVisitors) {
      this.visitors.forEach(visitor => {
        /** If the visitor has been disposed since the last iteration, free it from the store. */
        if (visitor.disposed) {
          this.removeVisitor(visitor);
          return;
        }

        /** Disposed visitors should not be notified. */
        callback(visitor);
      });
    }
  }

  visitChildContainer(child: ContainerInstance): void {
    this.forEach(visitor => visitor.visitChildContainer?.(child));
  }

  visitOrphanedContainer(container: ContainerInstance): void {
    this.forEach(visitor => visitor.visitOrphanedContainer?.(container));
  }

  visitNewService(serviceOptions: ServiceMetadata<unknown>): void {
    this.forEach(visitor => visitor.visitNewService?.(serviceOptions));
  }

  visitRetrieval(identifier: ServiceIdentifier<unknown>, options: VisitRetrievalOptions): void {
    this.forEach(visitor => visitor.visitRetrieval?.(identifier, options));
  }

  /**
   * Add a visitor to the collection.
   * @experimental
   *
   * @param visitor The visitor to append to the collection.
   * @param container The container to initialise the container on.
   */
  addVisitor(visitor: ContainerTreeVisitor, container: ContainerInstance) {
    /** If the visitor is already present, do not add another. */
    if (this.visitors.includes(visitor)) {
      return false;
    }

    if ('visitOrphanedContainer' in visitor && container !== defaultContainer) {
      /**
       * Orphaned container events are only dispatched on the default container.
       * Therefore, we need to create a proxy that forwards this event from the
       * default container to this visitor.
       */
      VisitorCollection.forwardOrphanedContainerEvents(visitor);
    }

    this.visitors.push(visitor);

    /**
     * Mark the collection as having visitors present, so
     * it doesn't ignore any events passed to it.
     */
    if (!this.anyVisitorsPresent) {
      this.anyVisitorsPresent = true;
    }

    /**
     * Directly call the visitor's "visitContainer" method
     * to initialise it upon the given container.
     *
     * Implementation detail: We don't provide any sort of protection against
     * this being called again on a different container.
     * The visitor would be able to handle that themselves, as the API states
     * that any call to `visitContainer` means that the visitor was added
     * to a container.
     */
    const isAllowedToAttachVisitor = visitor.visitContainer?.(container);

    /**
     * If a false-y return value was returned to signal that the visitor
     * should not be attached to the given container, immediately remove it.
     */
    if (!isAllowedToAttachVisitor) {
      this.removeVisitor(visitor);
      return false;
    }

    return true;
  }

  /**
   * Remove a visitor from the collection,
   * if it was already present.
   * @experimental
   *
   * @param visitor The visitor to remove from the collection.
   */
  removeVisitor(visitor: ContainerTreeVisitor) {
    const indexOfVisitor = this.visitors.indexOf(visitor);

    if (indexOfVisitor === -1) {
      return false;
    }

    /** Remove the element from the array via "splice". */
    this.visitors.splice(indexOfVisitor, 1);

    /** Re-evalute the length of the visitors array and recompute anyVisitorsPresent. */
    if (this.visitors.length === 0) {
      this.anyVisitorsPresent = false;
    }

    return true;
  }

  /**
   * Forward any orphaned container events to the visitor
   * through a proxy visitor attached to the default container.
   *
   * This is used when a visitor implements the {@link ContainerTreeVisitor.visitOrphanedContainer}
   * handler, but the visitor was attached to a non-default container instance.
   */
  protected static forwardOrphanedContainerEvents(upstreamVisitor: ContainerTreeVisitor) {
    const proxyVisitor: ContainerTreeVisitor = {
      get disposed() {
        return upstreamVisitor.disposed;
      },

      dispose() {
        /** Should we forward the dispose upstream here? */
        this.disposed = true;
      },

      visitOrphanedContainer(container: ContainerInstance) {
        if (!this.disposed) {
          upstreamVisitor.visitOrphanedContainer?.(container);
        }
      },

      visitContainer(container: ContainerInstance) {
        return container === defaultContainer;
      },
    };

    return defaultContainer.acceptTreeVisitor(proxyVisitor);
  }

  public dispose() {
    /** Prevent duplicate calls to dispose. */
    if (this.disposed) {
      return;
    }

    this.disposed = true;

    /** Notify all containers of disposal. */
    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- who cares??
    this.forEach(visitor => visitor.dispose());
  }
}
