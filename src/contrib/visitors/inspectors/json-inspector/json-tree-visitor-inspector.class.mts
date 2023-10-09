import { ContainerInstance, ContainerTreeVisitor, ServiceIdentifier, ServiceMetadata, VisitRetrievalOptions } from "../../../../index.mjs";

export class JSONTreeVisitorInspector implements ContainerTreeVisitor {
    visitChildContainer?(child: ContainerInstance): void {
        throw new Error("Method not implemented.");
    }

    visitOrphanedContainer?(container: ContainerInstance): void {
        throw new Error("Method not implemented.");
    }

    visitNewService?(serviceOptions: ServiceMetadata<unknown>): void {
        throw new Error("Method not implemented.");
    }

    visitContainer?(container: ContainerInstance): boolean {
        throw new Error("Method not implemented.");
    }

    visitRetrieval?(identifier: ServiceIdentifier<unknown>, options: VisitRetrievalOptions): void {
        throw new Error("Method not implemented.");
    }

    disposed = false;
    dispose(): void | Promise<void> {
        if (this.disposed) {
            throw new Error('The JSON tree visitor has already been disposed.');
        }

        this.disposed = true;
    }
    
}
