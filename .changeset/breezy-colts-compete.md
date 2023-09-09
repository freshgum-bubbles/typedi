---
'@freshgum/typedi': minor
---

Properties of all custom errors (`CannotInstantiateBuiltInError`, `CannotInstantiateValueError`, `ContainerRegistryError`, and `ServiceNotFoundError`) are now readonly. This prevents them being accidentally changed by external code.

If your code relies upon these properties being mutable, please consider re-wrapping the error in your own error class.
