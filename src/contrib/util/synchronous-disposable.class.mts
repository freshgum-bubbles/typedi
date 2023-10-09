import { Disposable } from '../../types/disposable.type.mjs';

export class SynchronousDisposable implements Disposable {
  public disposed = false;

  dispose() {
    if (this.disposed) {
      throw new Error('The object has already been disposed.');
    }

    this.disposed = true;
  }
}
