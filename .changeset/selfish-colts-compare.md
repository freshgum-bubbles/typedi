---
'@freshgum/typedi': minor
---

The ContainerInstance.dispose method now runs semi-synchronously. This means that, immediately after calling it, the `disposed` property will be set to `true`. This is a semi-preemptive fix for situations where, due to the method previously being marked as `async`, the property would not be set in the same event loop iteration.
