---
'@freshgum/typedi': minor
---

The `ESService` decorator now supports classes with static properties.
This was an oversight in the original design of the decorator's signature.

This change affects the type parameters consumed by `ESService`; the main difference
being that there is now a second parameter, `TClass`, which directly pertains to the
type of the class being decorated (and thus, the type returned by the decorator.)

Therefore, the type parameters of the function have changed from [`T = unknown`][esservice-old-type-params]
to [`TInstance = unknown, TClass extends Constructable<TInstance> = Constructable<TInstance>`][esservice-new-type-params].

Current code which relies on the type signature of `ESService` will not be affected.

[esservice-old-type-params]: https://github.com/freshgum-bubbles/typedi/blob/4c76133d3a94e119d5b4d44846213df42d3010a5/src/contrib/es/es-service.decorator.mts#L38
[esservice-new-type-params]: https://github.com/freshgum-bubbles/typedi/blob/a3825b77fadf6143f282e5cf4b68c084076b8369/src/contrib/es/es-service.decorator.mts#L38
