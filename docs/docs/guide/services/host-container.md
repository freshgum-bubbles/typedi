---
sidebar_position: 7
---

# HostContainer

Sometimes, you'll encounter a situation within your app that
requires breaking out of the more expressive decorator syntax.

This might be to check whether certain dependencies exist,
or to perform any computations on the application's container.

To do this, TypeDI helpfully provides the `HostContainer` function,
which allows you to inject a service's executing container into
the service.

:::caution

HostContainer is considered an _"escape hatch"_, and it should be avoided where possible.

This is called the Service Locator pattern, and it's only useful in certain scenarios.
In many cases, [it's typically considered an anti-pattern][sl-anti-pattern-by-mark-seemann]. <sup>[(archive)][sl-anti-pattern-by-mark-seemann-archive]</sup>

If misused, it could mean that the dependencies of your serivce become opaque,
where the only way to see what the service requires is to view its implementation.

:::

The HostContainer function returns a Token which, when passed to a DI container,
resolves to the container itself. This means that the returned Token from `HostContainer` can also be passed to `Container.get`.

```ts
import { ContainerInstance, HostContainer, Service } from '@freshgum/typedi';

@Service([
  // highlight-revision-start
  HostContainer(),
  // highlight-revision-end
])
export class MyService {
  // highlight-revision-start
  constructor(private container: ContainerInstance) {
    // highlight-revision-end
    if (container.has(MyService)) {
      console.log('Hello world!');
    }
  }
}
```

[sl-anti-pattern-by-mark-seemann]: https://blog.ploeh.dk/2010/02/03/ServiceLocatorisanAnti-Pattern/
[sl-anti-pattern-by-mark-seemann-archive]: https://web.archive.org/web/20230208143016/https://blog.ploeh.dk/2010/02/03/ServiceLocatorisanAnti-Pattern/
[aaa]: https://blog.ploeh.dk/2010/02/03/ServiceLocatorisanAnti-Pattern/
