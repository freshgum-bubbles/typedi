---
'@freshgum/typedi': major
---

The `ESService` decorator now supports classes with static properties.
This was an oversight in the original design of the decorator's signature.

**This is a breaking change**, as it affects the type parameters consumed by `ESService`;
the main difference being that there is now a second parameter, `TClass`, which directly
pertains to the type of the class being decorated (and thus, the type returned by the decorator.)

Therefore, the type parameters of the function have changed from [`T = unknown`][esservice-old-type-params]
to [`TInstance, TClass extends Constructable<TInstance> = Constructable<TInstance>`][esservice-new-type-params].

Any calls to `ESService` without the usage of its' type parameters should not be affected by this change.
