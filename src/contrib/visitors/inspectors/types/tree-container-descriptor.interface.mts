
import { TreeContainerRetrievalDescriptor } from "./tree-retrieval-descriptor.interface.mjs";
import { TreeServiceDescriptor } from "./tree-service-descriptor.interface.mjs";

// todo: add tsdoc to all of this

export const enum TreeContainerDescriptorType {
    Orphaned,
    Child,
    Parent
}

export interface BaseTreeContainerDescriptor {
    readonly retrievals: TreeContainerRetrievalDescriptor[];
}

export interface TreeOrphanedContainerDescriptor {
    readonly type: TreeContainerDescriptorType.Orphaned;
    readonly services: TreeServiceDescriptor[];
}

export interface TreeChildContainerDescriptor {
    readonly type: TreeContainerDescriptorType.Child;
    readonly parent: TreeContainerDescriptor;
    readonly services: TreeServiceDescriptor[];
}

export interface TreeParentContainerDescriptor {
    readonly type: TreeContainerDescriptorType.Parent;
    readonly services: TreeServiceDescriptor[];
    readonly children: TreeChildContainerDescriptor[];
}

export type TreeContainerDescriptor =
    | TreeOrphanedContainerDescriptor
    | TreeChildContainerDescriptor
    | TreeParentContainerDescriptor;
