---
sidebar_position: 2
---

# Creating Containers

TypeDI maintains a global container registry, which is a shared
registry of all containers it knows about.  
Aside from [custom containers](custom-containers.md), all newly-created
containers are added to the registry.

:::tip

By default, if a container with the same name already
exists, it is returned.

:::

There are multiple ways to create a container, each of which
will be demonstrated below.

## `ContainerInstance.of(id, parent?, options?)`

[<sup>**API Reference**</sup>][container-of-static-api-ref]

The static `of` method can be used to create both orphaned and child containers, like so:

```ts
import { ContainerInstance } from '@typed-inject/injector';

// Create an orphaned container:
ContainerInstance.of('my-new-container', null);

// Create a container as a child of the default container:
ContainerInstance.of('my-second-new-container', defaultContainer);
```

If the second parameter, `parent`, is not provided, then it defaults to the default container.

## `Container.of(id, options?)`

[<sup>**API Reference**</sup>][container-of-api-ref]

The instance method `of` can also be used to create containers,
in
XXX

## `Container.ofChild(id, options?)`

[<sup>**API Reference**</sup>][container-ofchild-api-ref]

The instance `ofChild` method can be used to create a container 
which is a child of the current. For example:

```ts
import { Container } from '@typed-inject/injector';

// Create a child of the default container:
const newContainer = Container.ofChild('my-new-container');
assert(newContainer.parent === Container);

// You can also create a child of a child!
const newNewContainer = newContainer.ofChild('my-really-new-container');
assert(newNewContainer.parent === newContainer);
```

## Creation Options

In each of the above methods, an options parameter [of type `CreateContainerOptions`][creation-opts-api-ref] can optionally be provided.
These options dictate how TypeDI should handle certain situations, such as when...
  - a container with the ID already exists *(a conflict)*
  - a container with the ID does not exist *(free)*

In many situations, you'll want an operation to fail if it means
it returns a container with the same ID, but with completely different characteristics.

Consider the following *(incorrect)* example:
```ts
// Create an orphaned container.
ContainerInstance.of('my-container', null);

// Create a child of the default container. 
// highlight-error-comment-start
Container.ofChild('my-container');
// highlight-error-comment-end
```

As the call to `ofChild` specifies an ID which already exists in the container registry,
the existing (orphaned) container is returned.  This 


[creation-opts-api-ref]: pathname:///api-reference/interfaces/CreateContainerOptions.html
[container-of-api-ref]: pathname:///api-reference/classes/ContainerInstance.html#of
[container-of-static-api-ref]: pathname:///api-reference/classes/ContainerInstance.html#of-2
[container-ofchild-api-ref]: pathname:///api-reference/classes/ContainerInstance.html#ofChild














