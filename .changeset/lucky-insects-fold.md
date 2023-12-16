---
'@freshgum/typedi': minor
---

**This is a breaking change for anyone constructing `TypeWrapper` objects.**

Internal `TypeWrapper` objects have been refactored.

Now, the `eagerType` property is optional, and the `lazyType` property has been removed. This has been changed because the `lazyType` property was part of broader lazy functionality (alongside the `Lazy` function) which was mainly a remnant from the upstream TypeDI project.

Lazy reference functionality has been moved into a contributory package, appropriately named *lazy-ref*.  This package contains a new `LazyRef` function, which allows for holding weak, or "lazy" references to services.

This functionality is mainly useful for working around unavoidable cyclic dependencies, though it should be noted that the appearance of cyclic dependencies may suggest that your service structure requires refactoring (Are you placing too much functionality into one service?)

