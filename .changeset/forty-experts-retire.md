---
'@freshgum/typedi': minor
---

**We now support ES decorators**! Grab the new ESService decorator from contrib/es!

To use this, you'll need to disable `experimentalDecorators` in your TypeScript
configuration file.  Note that, by doing this, you won't be able to utilise the
legacy decorators included in the package (`Service`).

Here's an example:

```ts
import { ESService } from '@freshgum/typedi/contrib/es';

@ESService([ ])
export class MyService { }
```

Note that the **legacy decorators have not been removed** for backwards-compatibility
reasons: you're still able to use them just as before.

Many thanks to Axel Rauschmayer for providing
[a very detailed guide re: ES decorators](https://2ality.com/2022/10/javascript-decorators.html).