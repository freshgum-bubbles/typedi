---
'@freshgum/typedi': patch
---

The internal `PickRequired` type has been replaced with `SetRequired` from type-fest, to take further advantage of the dependency. This change does not affect consumers of the package.
