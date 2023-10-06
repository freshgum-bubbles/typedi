---
'@freshgum/typedi': minor
---

Containers in the `ContainerRegistry` are now part of a stronger-typed collection. This prevents manual `.set` calls to the registry where the key is not equivalent to that of the value being set.
