---
'@freshgum/typedi': minor
---

Dependencies are now checked from a generic layer. This means that now, `Container.set` checks services' dependencies, as well as the `Service` decorator.
