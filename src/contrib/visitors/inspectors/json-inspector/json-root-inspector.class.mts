import {
  ContainerInstance,
  ContainerTreeVisitor,
  ServiceIdentifier,
  ServiceMetadata,
  VisitRetrievalOptions,
} from '../../../../index.mjs';
import { SynchronousDisposable } from '../../../util/synchronous-disposable.class.mjs';
import { TreeRootDescriptor } from '../types/tree-root-descriptor.interface.mjs';

export class JSONRootContainerInspector extends SynchronousDisposable implements ContainerTreeVisitor {
  private root: TreeRootDescriptor = { containers: [] };
  private container: ContainerInstance | null = null;

  visitOrphanedContainer?(container: ContainerInstance): void {
    throw new Error('Method not implemented.');
  }

  visitContainer?(container: ContainerInstance): boolean {
    if (this.disposed) {
      throw new Error('A disposed JSONRootContainerInspector instance cannot be added as a visitor to a container.');
    }

    if (this.container) {
      throw new Error('The JSONRootContainerInspector is already attached to a container.');
    }

    this.container = container;
    return true;
  }
}
