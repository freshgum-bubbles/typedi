---
'@freshgum/typedi': minor
---

In minified builds, certain members of classes are now mangled. This mainly applies to the internal tree-visitor collection API, though it is also applied to `ContainerInstance.throwIfDisposed`.
