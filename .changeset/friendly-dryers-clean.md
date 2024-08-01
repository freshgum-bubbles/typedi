---
'@freshgum/typedi': minor
---

Internal `TypeWrapper` objects have been refactored.

Now, the `eagerType` property is optional, and the `lazyType` property has been removed.
This has been changed because the `lazyType` property was part of broader lazy functionality
(alongside the `Lazy` function) which was mainly a remnant from the upstream TypeDI project.

*The `lazyType` functionality was mostly useless, as it did not resolve cyclic dependency issues.
See the introduction of `LazyRef` for more information.*

To migrate your usage of `TypeWrapper` objects, ensure your code handles cases where `eagerType`
may evaluate to `undefined`.  In this case, it is most likely that the provided type wrapper is
extractable.

Further, attempted construction of non-extractable type wrapper objects without an `eagerType`
(via the container's service instantiation functionality) will result in a runtime error.
This will not raise a compile-time, however, as doing so would require changing `TypeWrapper`
to a type instead of an interface, which may cause headaches for implementors using the interface
to implement classes.