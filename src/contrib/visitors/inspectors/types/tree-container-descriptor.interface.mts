// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ContainerIdentifier, ContainerInstance } from '../../../../index.mjs';
import { TreeRetrievalDescriptor } from './tree-retrieval-descriptor.interface.mjs';
import { TreeServiceDescriptor } from './tree-service-descriptor.interface.mjs';

/** An object representation of a {@link ContainerInstance}. */
export interface TreeContainerDescriptor {
  /** The identifier of the container. */
  readonly identifier: ContainerIdentifier;

  /** A sorted list of retrieval operations performed on this container. */
  readonly retrievals: TreeRetrievalDescriptor[];

  /** An array of services provided by this container. */
  readonly services: TreeServiceDescriptor[];

  /** An array of children provided by this container. */
  readonly children: TreeContainerDescriptor[];
}

export interface TreeContainerRootDescriptor extends TreeContainerDescriptor {
  readonly orphans: TreeContainerDescriptor[];
}
