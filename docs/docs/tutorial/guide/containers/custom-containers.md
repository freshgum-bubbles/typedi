---
sidebar_position: 1
---

# Custom Containers

In some scenarios, you may wish to change how containers work.
In this case, _custom containers_ may be appropriate.

In TypeDI, each container is always an instance of `ContainerInstance`.
However, you can _extend_ this class with custom functionality, and
then register it as an ordinary container.

In practice, this looks like the following:

```ts
import { ContainerInstance, ContainerRegistry, ServiceIdentifier, ContainerIdentifier } from '@freshgum/typedi';

export class MyContainerInstance {
  public constructor(id: ContainerIdentifier, parent?: ContainerInstance) {
    super(id, parent);
  }

  // ...
}

const newContainer = new MyContainerInstance('my-new-container');
ContainerRegistry.registerContainer(newContainer);
```

:::tip

Your custom container class will need a `public` constructor as,
currently, TypeDI's `ContainerInstance` has a `protected` constructor.

:::

Once your custom container has been registered, it functions as an ordinary
container. Calls to methods such as `ContainerInstance.of` return the custom instance.
