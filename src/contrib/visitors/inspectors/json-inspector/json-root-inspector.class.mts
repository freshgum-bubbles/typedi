import {
  ContainerInstance,
  ContainerTreeVisitor
} from '../../../../index.mjs';
import { SynchronousDisposable } from '../../../util/synchronous-disposable.class.mjs';
import { TreeContainerDescriptor, TreeContainerRootDescriptor } from '../types/tree-container-descriptor.interface.mjs';
import { JSONContainerInspector } from './json-container-inspector.class.mjs';

export class JSONRootContainerInspector extends SynchronousDisposable implements ContainerTreeVisitor {
  private orphans: JSONContainerInspector[] = [ ];
  public visitor: null | JSONContainerInspector = null;

  get descriptor (): TreeContainerRootDescriptor | null {
    const { visitor, orphans } = this;

    if (!visitor) {
      return null;
    }

    const { descriptor } = visitor;

    if (descriptor) {
      return {
        ...descriptor,
        orphans: orphans.map(x => x.descriptor as TreeContainerDescriptor)
      };
    }

    return null;
  }

  visitOrphanedContainer?(container: ContainerInstance): void {
    const visitor = new JSONContainerInspector();

    if (container.acceptTreeVisitor(visitor)) {
      this.orphans.push(visitor);
    }
  }

  visitContainer?(container: ContainerInstance): boolean {
    if (this.disposed) {
      throw new Error('A disposed JSONRootContainerInspector instance cannot be added as a visitor to a container.');
    }

    if (this.descriptor) {
      throw new Error('The JSONRootContainerInspector is already attached to a container.');
    }

    const visitor = new JSONContainerInspector();
    this.visitor = visitor;

    if(!container.acceptTreeVisitor(visitor)) {
      container.detachTreeVisitor(this);
      return false;
    }

    return true;
  }
}
