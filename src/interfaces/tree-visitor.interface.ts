import { ContainerInstance } from "../container-instance.class";
import { Disposable } from "../types/disposable.type";
import { ServiceIdentifier } from "../types/service-identifier.type";
import { ServiceMetadata } from "./service-metadata.interface";

/**
 * A collection of options passed to {@link ContainerTreeVisitor.visitRetrieval}.
 */
export interface VisitRetrievalOptions {
    /**
     * Whether the request was recursive.
     * If the option was not specified in the request, defaults to `true`.
     */
    recursive: boolean;

    /**
     * If true, the identifier was requested via the following methods:
     *   - {@link ContainerInstance.getMany}
     *   - {@link ContainerInstance.getManyOrNull}
     * 
     * Otherwise, the identifier was requested using:
     *   - {@link ContainerInstance.get}
     *   - {@link ContainerInstance.getOrNull}.
     */
    many: boolean;
}

/**
 * A visitor for Container objects, which allows for extension of container functionality.
 * @experimental **This API is still being developed.  It will probably change.**
 * 
 *
 * To aid usage of this API, some noteworthy points can be found below.
 * 
 * ## Visitors are Singletons (sort of)
 * 
 * By design, the visitor API is designed in such a manner that
 * each visitor can only be feasibly attached to a single container.
 * 
 * _This applies to child containers too_: any notifications from child
 * containers will not bubble up and trigger notifications on parent
 * containers.
 * 
 * The API does not prevent attaching a *new* visitor to any containers
 * passed to the visitor through either `visitOrpahanedContainer` or
 * `visitChildContainer`.  _This is the recommended approach._
 * 
 * ## Recursive Calls
 * 
 * _The API does not protect against recursion._
 * If, for example, the consumer adds a new service to the container in the
 * `visitNewService` method, there will be an infinite loop.
 * This can be remedied by guarding against any further recursive calls
 * for services added by the visitor; the implementation of that is left
 * to the consumer.
 * 
 * ## Container Reference
 * 
 * When a visitor is attached to a container, its `visitContainer` method is called.
 * This allows the visitor to then hold a persistent reference to said container,
 * allowing it to interact with the container as a regular consumer.
 * Therefore, the container the visitor is bound to is not passed for each function call.
 * It is up to the consumer to store the container and then perform operations on it later.
 * 
 * One important point which relates to the singleton aspect of the API design is that,
 * as a recommended approach, if the visitor's `visitContainer` is called more than once,
 * the later values should be ignored -- this was most likely caused due to the visitor
 * being added to more than one container.
 * 
 * ---
 * 
 * @example
 * A simple example of the visitor API is as follows:
 * ```ts
 * class LoggingTreeVisitor implements ContainerTreeVisitor {
 *   public container!: ContainerIdentifier;
 * 
 *   visitContainer (container: ContainerIdentifier) {
 *     if (!this.container) {
 *       this.container = container;
 *     }
 *   }
 * 
 *   visitNewService (options: ServiceOptions<unknown>) {
 *     console.log('New service added to container: ', options.id);
 *   }
 * }
 * ```
 * (This is a very simplified example and use-case.)
 */
export interface ContainerTreeVisitor extends Disposable {
    /**
     * Visit a child container of the current service.
     * @experimental
     * 
     * @param child The newly-created child container of the current instance.
     */
    visitChildContainer? (child: ContainerInstance): void;

    /**
     * Visit a container with no parent.
     * This is only called if the visitor was attached to the default container.
     * @experimental
     * 
     * @param container The newly-created container.
     */
    visitOrphanedContainer? (container: ContainerInstance): void;

    /**
     * Visit a new service being added to the container.
     * This is called when a new service is added via `Container.set(...)`.
     * @experimental
     * 
     * @param serviceOptions The options of the new service.
     */
    visitNewService? (serviceOptions: ServiceMetadata<unknown>): void;

    /**
     * Visit the given container.
     * This is called as a result of `Container.acceptTreeVisitor(...)`.
     * @experimental
     * 
     * @param container The container to visit.
     * 
     * @returns Whether the visitor can be attached to the container.
     * If `false` is returned, no notifications are sent from the provided container.
     * Otherwise, all notifications from the passed are sent to the visitor.
     */
    visitContainer? (container: ContainerInstance): boolean;

    /**
     * Visit an unavailable service in the given container.
     * This is called when a given identifier cannot be found in the container.
     * @experimental
     * 
     * @param identifier The identifier of the unavailable service.
     */
    visitUnavailableService? (identifier: ServiceIdentifier, many: boolean): void;

    /**
     * Visit a request for a container to retrieve a service.
     * @experimental
     *
     * This is similar to the `visitUnavailableService` handler, but it
     * is always called in the event of service retrieval.
     * If the identifier can not be found, `visitUnavailableService` is then called.
     *
     * @param identifier The identifier of the requested service.
     *
     * @param options A set of options passed to the listener.
     * Documented in {@link VisitRetrievalOptions}.
     */
    visitRetrieval? (identifier: ServiceIdentifier<unknown>, options: VisitRetrievalOptions): void;
}
