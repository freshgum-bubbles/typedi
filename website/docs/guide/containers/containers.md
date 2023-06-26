---
sidebar_position: 1
---

# Introduction

Containers power the majority of TypeDI. They're used to store, retrieve and instantiate services on-the-fly.
Crucially, a TypeDI-dependent application must have a container to function.

## Default Container

Thankfully, TypeDI provides one by default, which is aptly named the *default container*.
By default, services are attached to this, and can be retrieved at any time (like we saw in our [Hello World!](../../examples/hello-world.md) example.)

To get the default container, we just need to import `Container` from TypeDI:

```ts
import { Container } from 'typedi';
```



:::tip

You can attach services to other containers, too.

:::
