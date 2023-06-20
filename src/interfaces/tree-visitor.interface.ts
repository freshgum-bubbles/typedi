import { ContainerInstance } from "../container-instance.class";
import { Disposable } from "../types/disposable.type";
import { ServiceIdentifier } from "../types/service-identifier.type";
import { ServiceOptions } from "./service-options.interface";

/**
 * A visitor for Container objects, which allows for extension of container functionality.
 * @experimental
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
    visitNewService? (serviceOptions: ServiceOptions<unknown>): void;

    /**
     * Visit the given container.
     * This is called as a result of `Container.acceptVisitor(...)`.
     * @experimental
     * 
     * @param container The container to visit.
     */
    visitContainer? (container: ContainerInstance): void;

    /**
     * Visit an unavailable service in the given container.
     * This is called when a given identifier cannot be found in the container.
     * @experimental
     * 
     * @param identifier The identifier of the unavailable service.
     */
    visitUnavailableService? (identifier: ServiceIdentifier): void;
}