# @freshgum/typedi

## 0.5.0

### Minor Changes

- 4e99704: Type wrappers have been refactored! All internal type-wrappers (Lazy, TransientRef, etc.) have been refactored into new "extractable type-wrappers"; this simplifies the implementation. Unless you're writing custom type-wrappers, this won't affect you!
- 7512978: Introduction of a TransientRef function to get references to transient services without HostContainer.

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
