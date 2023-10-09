---
'@freshgum/typedi': minor
---

A new `SynchronousDisposable` class has been added to `contrib/util`. This class manages the small amount of boilerplate involved in setting up and managing a container-compliant disposable object (implementing `Disposable`).

As an example...
```ts
import { Disposable } from '@freshgum/typedi';
import { SynchronousDisposable } from '@freshgum/typedi/contrib/util/synchronous-disposable';

export class MyClass extends SynchronousDisposable implements Disposable {
    public override dispose () {
        super.dispose();
        // Run custom disposal logic here...
    }

    public myMethod () {
        if (this.disposed) {
            throw new Error('The MyClass instance has already been disposed.');
        }

        // ...
    }
}
```

It has three responsibilities:
  1. Throwing if `dispose` has been called more than once.
  2. Setting the `disposed` property.
  3. Being compliant with the container.

To keep the API surface minimal, no other functionality has or will be implemented via this class.

The use-case of *writing methods without worrying about whether the object has been disposed* is being investigated,
as the container makes extensive use of disposal itself.
