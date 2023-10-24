/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ContainerInstance,
  ContainerTreeVisitor,
  ServiceIdentifier,
  ServiceMetadata,
  VisitRetrievalOptions,
} from '../../../../index.mjs';
import { SynchronousDisposable } from '../../../util/synchronous-disposable.class.mjs';
import {
  TreeContainerDescriptorType,
  TreeParentContainerDescriptor,
} from '../types/tree-container-descriptor.interface.mjs';
import { TreeRetrievalDescriptor } from '../types/tree-retrieval-descriptor.interface.mjs';
import { TreeServiceDescriptor } from '../types/tree-service-descriptor.interface.mjs';

export class JSONContainerInspector extends SynchronousDisposable implements ContainerTreeVisitor {
  public descriptor: TreeParentContainerDescriptor | null = null;
  public container: ContainerInstance | null = null;

  visitChildContainer?(childContainer: ContainerInstance): void {
    /** Attach a new inspector to the child. */
    const childInspector = new JSONContainerInspector();
    childContainer.acceptTreeVisitor(childInspector);
    const { descriptor } = childInspector;

    /** Add the child container's descriptor as a child of ours. */
    this.descriptor!.children.push(descriptor!);
  }

  visitNewService?<T = unknown>(newServiceMetadata: ServiceMetadata<T>): void {
    const serviceDescriptor: TreeServiceDescriptor<T> = { metadata: newServiceMetadata };
    this.descriptor!.services.push(serviceDescriptor);
  }

  visitContainer?(container: ContainerInstance): boolean {
    if (this.disposed) {
      throw new Error('A disposed JSONContainerInspector instance cannot be added as a visitor to a container.');
    }

    /** Prevent the visitor being added if it is already attached to a container. */
    if (this.container) {
      throw new Error('The JSONContainerInspector is already attached to a container.');
    }

    /** Lazily initialize the class' fields. */
    this.container = container;
    this.descriptor = {
      type: TreeContainerDescriptorType.Parent,
      identifier: container.id,
      children: [] as TreeParentContainerDescriptor[],
      services: [] as TreeServiceDescriptor[],
      retrievals: [] as TreeRetrievalDescriptor[],
    };

    return true;
  }

  visitRetrieval?(identifier: ServiceIdentifier<unknown>, options: VisitRetrievalOptions): void {
    const currentTime = this.getCurrentTime();
    const retrievalDescriptor: TreeRetrievalDescriptor = {
      time: currentTime,
      identifier,
      options,
    };

    this.descriptor!.retrievals.push(retrievalDescriptor);
  }

  /**
   * Get the current system time.
   *
   * @remarks
   * The default implementation makes use of `performance.now()` to measure time.
   *
   * @returns The current time in milliseconds.
   */
  protected getCurrentTime() {
    return performance.now();
  }
}
