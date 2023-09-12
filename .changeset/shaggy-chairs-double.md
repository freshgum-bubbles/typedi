---
'@freshgum/typedi': minor
---

Introduction of a TransientRef function to get references to transient services without HostContainer.

This is related to [Issue #28](https://github.com/freshgum-bubbles/typedi/issues/28).

As a quick example of the syntax:

```ts
import { Service } from '@freshgum/inject';
import { TransientRef } from '@freshgum/inject/contrib/transient-ref';

@Service({ scope: 'transient' }, [])
class MyTransientService {}

@Service([TransientRef(MyTransientService)])
class MyService {
  constructor(private myTransient: TransientRef<MyTransientService>) {
    assert(myTransient.create() !== myTransient.create());
  }
}
```
