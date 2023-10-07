---
'@freshgum/typedi': minor
---

The expected scope of an identifier can now be passed to functions such as `Container.has` to ensure that the identifier can be accessed via the expected method.

This fixes use-cases where an identifier may either point at a singular value, or multiple values.
In those cases, `Container.has(A)` does not provide any guarantees that `Container.get(A)` will not throw.

As an example...

```ts
const NAME = new Token<string>('Name');

Container.set({ id: NAME, value: 'Joanna' });

// Ensure we can access the identifier via Container.get(A).
if (Container.has(NAME, false, IdentifierScope.Singular)) {
  console.log(Container.get(NAME));
}

// This will throw:
Container.getMany(NAME);
```
