---
'@freshgum/typedi': patch
---

`ContainerInstance.getManyOrNull` and `ContainerInstance.getOrNull` no longer throws if the value of the metadata being attained is `null`.
