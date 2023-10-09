import { ContainerIdentifier } from '../../../../index.mjs';
import { TreeRetrievalDescriptor } from './tree-retrieval-descriptor.interface.mjs';
import { TreeServiceDescriptor } from './tree-service-descriptor.interface.mjs';

// todo: add tsdoc to all of this

export const enum TreeContainerDescriptorType {
  Orphaned,
  Parent
}

export interface BaseTreeContainerDescriptor {
  readonly retrievals: TreeRetrievalDescriptor[];
}

export interface TreeOrphanedContainerDescriptor extends BaseTreeContainerDescriptor {
  readonly type: TreeContainerDescriptorType.Orphaned;
  readonly services: TreeServiceDescriptor[];
}

export interface TreeParentContainerDescriptor extends BaseTreeContainerDescriptor {
  readonly identifier: ContainerIdentifier;
  readonly type: TreeContainerDescriptorType.Parent;
  readonly services: TreeServiceDescriptor[];
  readonly children: TreeParentContainerDescriptor[];
}

export type TreeContainerDescriptor =
  | TreeOrphanedContainerDescriptor
  | TreeParentContainerDescriptor;
