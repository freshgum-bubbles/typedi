---
'@freshgum/typedi': minor
---

`ContainerInstance.set` can now be called without dependencies if the metadata does not include a service.

This makes it easier to use `set` to set non-reconstructable values directly.  See the example below.

**Previous Behaviour**

```ts
const NAME = new Token<string>();
Container.set({ id: NAME, value: 'Joanna', dependencies: [ ] });
```

**New Behaviour**

```ts
const NAME = new Token<string>();
Container.set({ id: NAME, value: 'Joanna' });
```