---
'@freshgum/typedi': minor
---

The internal tree-visitor API now returns a `Promise` consisting of a `Promise.all` call, consisting of the return value of each visitor's `dispose` method.
