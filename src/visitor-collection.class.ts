import { ContainerInstance } from "./container-instance.class";
import { ServiceMetadata } from "./interfaces/service-metadata.interface";
import { ContainerTreeVisitor } from "./interfaces/tree-visitor.interface";
import { Disposable } from "./types/disposable.type";
import { ServiceIdentifier } from "./types/service-identifier.type";

/**
 * A collection of individual visitor objects, combined into a collection.
 * @experimental
 * 
 * This interface implements everything but "visitContainer", as that
 * should never be done at random for all elements.
 * Instead, it is done in the "addVisitor" method.
 * 
 * The class is implemented in a semi-stateless fashion: it holds no
 * persistent references to any particular collection.
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
    protected get notifyVisitors () {
        return !this.disposed && this.anyVisitorsPresent;
    }

    constructor () { }

    // the implementation below is very simple, there is definitely room for improvement.

    /**
     * Iterate the list of visitors, excluding any which have been disposed.
     * Does not perform any iteration if no visitors are present.
     * 
     * @param callback A function to call for each visitor in the collection.
     */
    public forEach (callback: { (visitor: ContainerTreeVisitor ): void }) {
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

    visitContainer(container: ContainerInstance): void {
        this.forEach(visitor => visitor.visitContainer?.(container));
    }

    visitUnavailableService(identifier: ServiceIdentifier, many: boolean): void {
        this.forEach(visitor => visitor.visitUnavailableService?.(identifier, many));
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

        this.visitors.push(visitor);

        /**
         * Mark the collection as having visitors present, so
         * it doesn't ignore any events passed to it.
         */
        if (!this.anyVisitorsPresent) {
            this.anyVisitorsPresent = true;
        }

        // todo: should visitContainer return false?
        // this could result in the collection removing it. we'd need to keep the visitor in-place initially,
        // as if the container calls .get or anything in its visitContainer method, it would most likely want to
        // get called if the service was unavailable / any new ones were added, etc.

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
        visitor.visitContainer?.(container);
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

    public dispose() {
        /** Prevent duplicate calls to dispose. */
        if (this.disposed) {
            return;
        }

        this.disposed = true;

        /** Notify all containers of disposal. */
        this.forEach(visitor => visitor.dispose());
    }
}