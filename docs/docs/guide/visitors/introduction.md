---
sidebar_position: 1
---

# Visitors

Visitors can be used to watch how applications interact with individual containers,
through creating individual visitors which are then attached to those containers.

These could be used to supplement container functionality, or to collect data on how
each container is used. As an example, TypeDI++ implements a [JSON Tree Visitor][source-json-tree-visitor],
which can be attached to a container and then serialized to JSON for an easily-understandable breakdown of...

1. Each `.get[Many]` call,
2. Newly-created containers,
3. How applications set values in individual containers.

:::note

The concept of visitors isn't new; in fact, [it's fairly well established][wikipedia-visitor-pattern]
as a way to extend objects without changing their structure.

:::

## Creating our first Visitor

As an example of how to use the API, let's create a partial reimplementation of the JSON Tree Visitor.

Firstly, we'll create a class called `BasicVisitor`, which implements the `ContainerTreeVisitor` interface.

The final required member of a `ContainerTreeVisitor` is `visitContainer`, which returns a boolean.
This boolean dictates whether the visitor allows the container to attach to it (this will be explained later).

```ts src="app/basic-visitor.class.ts"
import { ContainerTreeVisitor, ContainerInstance } from '@freshgum/typedi';

export class BasicVisitor implements ContainerTreeVisitor {
  visitContainer(container: ContainerInstance) {
    return true;
  }
}
```

## Attaching to a Container

The above example is a good start, though we haven't yet _attached_ the visitor to anything. Let's do so now.

```ts src="app/main.ts"
import { Container } from '@freshgum/typedi';
import { BasicVisitor } from './basic-visitor.class';

const visitor = new BasicVisitor();
Container.acceptTreeVisitor(visitor);
```

## Listening to events

xxx

## Disposing of a Visitor

xxx

## Lifecycle of a Visitor

When the above visitor is first attached to a container, the following happens:

1. The visitor's `visitContainer` method is called.
2. It returns `true`, so it's considered "attached" to the container.
3. Any retrievals, changes and new containers are reported to the visitor.

## Recommended Patterns

[wikipedia-visitor-pattern]: https://en.wikipedia.org/wiki/Visitor_pattern

<!-- Todo: change this to the develop/ branch once merged -->

[source-json-tree-visitor]: https://github.com/freshgum-bubbles/typedi/blob/16fe6517ae8298ca82e2c4119d2ff5ca3c3dea64/src/contrib/visitors/inspectors/json-inspector/json-container-inspector.class.mts
