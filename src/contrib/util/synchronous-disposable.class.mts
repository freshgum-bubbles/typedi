/**
 * @freshgum/typedi <https://github.com/freshgum-bubbles/typedi>
 *
 * @license MIT
 * Copyright (c) 2015-2021 TypeStack
 * Copyright (c) 2023-2024 freshgum (https://github.com/freshgum-bubbles)
 * For a full copy of the license, see the LICENSE file in the root folder.
 */

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
