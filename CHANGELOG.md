# @freshgum/typedi

## 0.6.0

### Minor Changes

- 3fc9b19: A new `SynchronousDisposable` class has been added to `contrib/util`. This class manages the small amount of boilerplate involved in setting up and managing a container-compliant disposable object (implementing `Disposable`).

  As an example...

  ```ts
  import { Disposable } from '@freshgum/typedi';
  import { SynchronousDisposable } from '@freshgum/typedi/contrib/util/synchronous-disposable';

  export class MyClass extends SynchronousDisposable implements Disposable {
    public override dispose() {
      super.dispose();
      // Run custom disposal logic here...
    }

    public myMethod() {
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

  The use-case of _writing methods without worrying about whether the object has been disposed_ is being investigated,
  as the container makes extensive use of disposal itself.

- ef1dec3: Containers in the `ContainerRegistry` are now part of a stronger-typed collection. This prevents manual `.set` calls to the registry where the key is not equivalent to that of the value being set.
- 658d830: The ContainerInstance.dispose method now runs semi-synchronously. This means that, immediately after calling it, the `disposed` property will be set to `true`. This is a semi-preemptive fix for situations where, due to the method previously being marked as `async`, the property would not be set in the same event loop iteration.

### Patch Changes

- f319e65: type-fest is now listed as a dependency of this package. It contains types used in the typings of TypeDI++'s interfaces. Previously, it was listed as a devDependency -- this was a mistake.
- f6f1f37: TypeDI++ now has an [API Reference](https://typedi.js.org/api-reference/) page, which documents the exported symbols in the package. This was previously meant to be a part of the website, but got lost along the way :-)
- 224cc93: The Service decorator now uses the `Container` variable, as opposed to `ContainerInstance.defaultContainer`.
- 3d32c26: The container now removes visitors which throw an error in their `visitContainer` method.
  Previously, this resulted in them still receiving notifications from the attached container.
- 4274c22: Fix for Node not resolving the package entrypoint under certain scenarios.
- 8b13caa: The `ContainerRegistry.removeContainer` method no longer disposes already-disposed containers. This may have been an issue if a container was disposed, and then `removeContainer` was called; the call would always fail, as the registry attempted a disposal upon the container when doing so was invalid.

## 0.5.0

### Minor Changes

- 4e99704: Type wrappers have been refactored! All internal type-wrappers (`Lazy`, `TransientRef`, etc.) have been refactored into new "extractable type-wrappers"; this simplifies the implementation. Unless you're writing custom type-wrappers, this won't affect you!
- 7512978: Introduction of a `TransientRef` function to get references to transient services without `HostContainer`.

  This is related to [Issue #28](https://github.com/freshgum-bubbles/typedi/issues/28).

  As a quick example of the syntax:

  ```ts
  import { Service } from '@freshgum/inject';
  import { TransientRef } from '@freshgum/inject/contrib/transient-ref';

  @Service({ scope: 'transient' }, [])
  class MyTransientService {}

  @Service([TransientRef(MyTransientService)])
  class MyService {
    constructor(private myTransient: TransientRef<MyTransientService>) {
      assert(myTransient.create() !== myTransient.create());
    }
  }
  ```

- b3c3814: Refactor the package exports (use ES Modules, and package.json's "exports" property), and force a minimum Node version of 15.3.0.
- 7dab124: IDs set with "multiple: true" are now properly recursive! This means that they're inherited just like regular identifiers. This makes them much easier to work with.

## 0.4.0

### Minor Changes

- 257078f: The `ServiceIdentifierLocation` enum now consists of numbers instead of strings.
- ed70b4c: Properties of all custom errors (`CannotInstantiateBuiltInError`, `CannotInstantiateValueError`, `ContainerRegistryError`, and `ServiceNotFoundError`) are now readonly. This prevents them being accidentally changed by external code.

  If your code relies upon these properties being mutable, please consider re-wrapping the error in your own error class.

- 9041587: Dependencies are now checked from a generic layer. This means that now, `Container.set` checks services' dependencies, as well as the `Service` decorator.
- d99665a: The internal tree-visitor API now returns a `Promise` consisting of a `Promise.all` call, consisting of the return value of each visitor's `dispose` method.
- c861901: Singletons are no longer imported into containers which use them.

  This is a relatively minor change, and one which improves the consistency of the core API. Now, when a container uses a singleton, it calls the Container's `get` method, instead of importing the metadata relating to the singleton into the container.

  This means that if the value of a singleton changes, it will be updated from retrospective calls to other containers' `get` methods.

- 8df7fff: `ContainerInstance.set` can now be called without dependencies if the metadata does not include a service.

  This makes it easier to use `set` to set non-reconstructable values directly. See the example below.

  **Previous Behaviour**

  ```ts
  const NAME = new Token<string>();
  Container.set({ id: NAME, value: 'Joanna', dependencies: [] });
  ```

  **New Behaviour**

  ```ts
  const NAME = new Token<string>();
  Container.set({ id: NAME, value: 'Joanna' });
  ```

- 705f094: In minified builds, certain members of classes are now mangled. This mainly applies to the internal tree-visitor collection API, though it is also applied to `ContainerInstance.throwIfDisposed`.
- 6cb70e8: Container.detachTreeVisitor and Container.attachTreeVisitor now throw if the container has been disposed.
- 67ec0db: Service factories are now provided with different parameters: the first is the `ContainerInstance` the identifier is being constructed from, the second is the identifier of the service, and the third is the service's parameters.
- e0f215b: Service factories are now typed with the new `ServiceFactory` type. This provides IntelliSense for arguments provided to the factory.

### Patch Changes

- aae8295: `ContainerInstance.getManyOrNull` and `ContainerInstance.getOrNull` no longer throws if the value of the metadata being attained is `null`.
