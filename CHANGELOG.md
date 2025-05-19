# @freshgum/typedi

## 0.0.0-experimental-2-20250519235321

### Major Changes

- 40c0f8c7: **This is a breaking change to the core API**.

  The container no longer provides a default `containerId` parameter for the following methods:

  - `ContainerInstance.ofChild`
  - `ContainerInstance.of`
  - `static ContainerInstance.of`

  In retrospect, this was a bad idea. I'll explain this further with the code below.

  ```ts
  import { Container } from '@freshgum/typedi';

  const c1 = Container.ofChild(Symbol('c1'));

  @Service({ container: c1 }, [])
  class MyService {}

  const c2 = c1.ofChild();

  c2.get(MyService); // -> ServiceNotFoundError
  ```

  Ignoring the hints above, the problem with this code may not be obvious at a first glance.
  While you'd _assume_ the call to `c1.ofChild()` returns a child container of `c1` (which
  would then inherit its services), it's actually just returned an exact reference to the
  default container (`Container` itself.)

  This raises a great deal of ambiguity, as it's no longer immediately clear whether a call
  to these methods does as you would initially expect.

  Therefore, type-safe calls to these methods without a container ID will now raise an error at
  compile-time.
  The signature of these methods has been changed to require the container ID parameter.

  **Migrating** away from this behaviour is quite simple: replace all calls to `X.ofChild()`
  with a reference to the default container (`Container`).

  Whilst I'm not a fan of making breaking changes to the Container, I believe this one makes
  sense in the pursuit of a safer, more streamlined API -- if you experience any issues with
  this, please feel free to open a GitHub issue.

### Minor Changes

- e70148c2: The `lazy` function has been renamed to `forwardRef`.

  In retrospect, the name of this function didn't clearly
  describe its purpose, which is to break cyclic dependency
  chains at the service initialization stage.

  The renaming of this function to `forwardRef` more clearly
  explains its function. The name was 1:1 inspired by Angular,
  which contains a function that does exactly the same thing.

  Note that, while `lazy` is deprecated, it will still be supported.
  The implementation of the `lazy` function has been moved to
  `forwardRef`, which is a 1:1 replacement for the former.

- 0111aebe: The `ESService` decorator now supports classes with static properties.
  This was an oversight in the original design of the decorator's signature.

  This change affects the type parameters consumed by `ESService`; the main difference
  being that there is now a second parameter, `TClass`, which directly pertains to the
  type of the class being decorated (and thus, the type returned by the decorator.)

  Therefore, the type parameters of the function have changed from [`T = unknown`][esservice-old-type-params]
  to [`TInstance = unknown, TClass extends Constructable<TInstance> = Constructable<TInstance>`][esservice-new-type-params].

  Current code which relies on the type signature of `ESService` will not be affected.

  [esservice-old-type-params]: https://github.com/freshgum-bubbles/typedi/blob/4c76133d3a94e119d5b4d44846213df42d3010a5/src/contrib/es/es-service.decorator.mts#L38
  [esservice-new-type-params]: https://github.com/freshgum-bubbles/typedi/blob/a3825b77fadf6143f282e5cf4b68c084076b8369/src/contrib/es/es-service.decorator.mts#L38

- 431fa275: Currently, ESService does not return its target. The usage of the `Constructable` type also causes issues, as it makes
  the decorator return the wrong type.

  This causes the following error:

  > "Decorator function return type 'void | Constructable<AuthStoreService>' is not assignable to type 'void | typeof AuthStoreService'".

  This occured when I added the decorator to a class which extended another.

  I've updated the decorator to return the target, as opposed to a wrapped version, and this seems to have fixed the issue.

### Patch Changes

- 02fe3cc2: The code for virtual tokens (such as `HostContainer()`) has been moved into individual tokens,
  as opposed to hosting logic for these tokens in `ContainerInstance`.

  This means that we no longer have to check for individual tokens in the container's
  `.get` code-path, [which has historically been the case.](https://github.com/freshgum-bubbles/typedi/blob/cd4b8437ac14882a0ed4d1964d76e29b32bd1b3e/src/container-instance.class.mts#L331)

  Instead, logic for these tokens is now moved into special tokens called Executable Tokens.

  This yields numerous advantages, one of which being that, should a certain special token go
  unused, its code can safely be removed from a bundle via dead-code elimination.

  While **this is mostly an internal change**, the concept of Executable Tokens works quite well,
  and so I'm considering making it part of the public API surface + documentation after further testing.

- ad8f4f6c: Dedicated entry-points have been added for web-facing builds <sup>([#184][gh-issue-184])</sup>.
  You're now able to use modules from contrib/ without relying on a bundler,
  or importing contrib/ packages separately from `/esm5/`.

  > [!NOTE] > **The changes made here do not impact current UMD / MJS entry-points.**
  >
  > If you're using these, you won't experience any changes.
  > To make use of contrib/ modules, you'll need to switch to the new builds shown above.

  The new entry-points are as follows (all files are under `./build/bundles/`):

  - `typedi.full.min.mjs` <sup>(ES Module format.)</sup>
  - `typedi.full.mjs`
  - `typedi.umd.full.js` <sup>([UMD][umd-module-explainer] modules.)</sup>
  - `typedi.umd.full.min.js`

  You can now do the following:

  ```js
  import Container, { Contrib } from 'https://unpkg.dev/@freshgum/typedi/build/bundles/typedi.full.mjs';

  // Let's use some modules:
  const { TransientRef, ES } = Contrib;
  assert(TransientRef.TransientRefHost);
  ```

  The same can be done using UMD modules, like so:

  ```html
  <!doctype html>
  <html>
    <head>
      <!-- ... -->
    </head>
    <body>
      <!-- Be sure to use subresource integrity in production! ;-) -->
      <script src="https://unpkg.dev/@freshgum/typedi/build/bundles/typedi.umd.full.min.js"></script>
      <script>
        const { Container, Contrib } = TypeDI;
        // ...
      </script>
    </body>
  </html>
  ```

  > [!TIP]
  > If you've noticed, you can actually import the Container through unpkg!
  >
  > Here's a link to the latest bundles: https://unpkg.dev/browse/@freshgum/typedi/build/bundles/

  ***

  I've been wanting to implement this for a while, but life has repeatedly found itself in the way.
  When spending some time on it, it was mostly a simple job: the majority of the work lied in creating
  a new build step to generate a barrel file for contrib/, and then integrating Rollup with that.

  If you're interested, the original code for this lies in [#184][gh-issue-184]. It's actually quite interesting!

  [umd-module-explainer]: https://jameshfisher.com/2020/10/04/what-are-umd-modules/
  [gh-issue-184]: https://github.com/freshgum-bubbles/typedi/pull/184

## 0.7.2

### Patch Changes

- 21b9f51: [SynchronousDisposable is actually usable now.](https://github.com/freshgum-bubbles/typedi/pull/167/commits/5228df1f98e6c13b90aa5c34094b9c312b6992c1)
  Prior to this, it was listed in `package.json` but wasn't importable.

  I'm really sorry about this: [Packaging certainly isn't my strongest point](https://github.com/freshgum-bubbles/typedi/issues/96), and to date, I've caught quite a few painful `package.json`-related errors in production.

  The upside to all this is that I'm working on making it better -- in fact, this issue was only caught
  when [adding publint checks for the package](https://github.com/freshgum-bubbles/typedi/pull/167). publint is an excellent tool that makes sure your package works well across different environments (and like... actually works).

  A few other things have been fixed too, namely:

  - [Loading the package from unpkg now works](https://unpkg.dev/@freshgum/typedi) <sup>[(commit)](https://github.com/freshgum-bubbles/typedi/pull/167/commits/d9ffcdda32c4414f71f3bc434fefc833e872d01d)</sup>
  - An error where the `default` export condition may have taken precedence over others <sup>[(commit)](https://github.com/freshgum-bubbles/typedi/pull/167/commits/8d9b447504be19ea1e4169c45ef025263f6e7a2e)</sup>

  I hope this changelog entry inspires you to start linting your `package.json`, because dealing with this stuff really sucks.

## 0.7.1

### Patch Changes

- 424485c: stripInternal has been disabled in the package's TSConfig due to it breaking fresh installs of the package. This shouldn't affect you unless you rely upon the container's internal `visitor` property, which has its properties mangled to reduce bundle size.

## 0.7.0

### Minor Changes

- 18372c6: **We now support ES decorators**! Grab the new ESService decorator from contrib/es!

  To use this, you'll need to disable `experimentalDecorators` in your TypeScript
  configuration file. Note that, by doing this, you won't be able to utilise the
  legacy decorators included in the package (`Service`).

  Here's an example:

  ```ts
  import { ESService } from '@freshgum/typedi/contrib/es';

  @ESService([])
  export class MyService {}
  ```

  Note that the **legacy decorators have not been removed** for backwards-compatibility
  reasons: you're still able to use them just as before.

  Many thanks to Axel Rauschmayer for providing
  [a very detailed guide re: ES decorators](https://2ality.com/2022/10/javascript-decorators.html).

### Patch Changes

- b26ad02: Add a new `getServiceIdentifierType` utility to ascertain the type of a given `ServiceIdentifier`. This allows for differentiation between virtual identifiers, such as `HostContainer`, and concrete identifiers set by you / any code which interacts with the `ContainerInstance`.
- 9ad853e: The `ContainerRegistryError` constructor is now exported from the package index. This allows for greater pattern-matching of errors which occur as a result of invalid registry operations.
- e18d944: An unused `PickPartial` utility type has been removed. This change does not affect consumers of the package.
- f4e10cf: The internal `PickRequired` type has been replaced with `SetRequired` from type-fest, to take further advantage of the dependency. This change does not affect consumers of the package.

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
