---
'@freshgum/typedi': major
---

**This is a breaking change to the core API**.

The container no longer provides a default `containerId` parameter for the following methods:

- `ContainerInstance.ofChild`
- `ContainerInstance.of`
- `static ContainerInstance.of`

In retrospect, this was a bad idea. I'll explain this further with the code below.

```ts
import { Container } from '@freshgum/typedi';

const c1 = Container.ofChild(Symbol('c1'));

@Service({ container: c1 }, [])
class MyService {}

const c2 = c1.ofChild();

c2.get(MyService); // -> ServiceNotFoundError
```

Ignoring the hints above, the problem with this code may not be obvious at a first glance.
While you'd _assume_ the call to `c1.ofChild()` returns a child container of `c1` (which
would then inherit its services), it's actually just returned an exact reference to the
default container (`Container` itself.)

This raises a great deal of ambiguity, as it's no longer immediately clear whether a call
to these methods does as you would initially expect.

Therefore, type-safe calls to these methods without a container ID will now raise an error at
compile-time.
The signature of these methods has been changed to require the container ID parameter.

**Migrating** away from this behaviour is quite simple: replace all calls to `X.ofChild()`
with a reference to the default container (`Container`).

Whilst I'm not a fan of making breaking changes to the Container, I believe this one makes
sense in the pursuit of a safer, more streamlined API -- if you experience any issues with
this, please feel free to open a GitHub issue.
