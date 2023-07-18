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
import { ContainerInstance, Container } from '@typed-inject/injector';

// Create an orphaned container:
ContainerInstance.of('my-new-container', null);

// Create a container as a child of the default container:
ContainerInstance.of('my-second-new-container', Container);
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

### Dealing with conflicts

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
the existing (orphaned) container is returned.  In most cases, this *isn't* what you want.
To remedy this, we can append a list of options to our `ofChild` call to fail if a
container with the ID already exists.

```ts
// Create an orphaned container.
ContainerInstance.of('my-container', null);

// Create a child of the default container.
Container.ofChild('my-container', {
  onConflict: 'throw'
});
```

The above example will throw an error due to the conflicting container IDs.
This is one of three [conflict strategies][conflictstrategy-api-ref] you can choose to resolve a conflict.

The others are as follows:
  - `'returnExisting'`: Return the existing container. This is the default.
  - `'throw'`: Throw an error upon conflict.
  - `'null'`: Return null upon conflict.`

A better solution would be to restrict the use of well-known string-based keys, replacing
them with well-known instances of `Symbol`.  Symbols, even with the same name, will never collide.

Let's update our example above to make use of Symbols instead:

```ts
export const MY_CONTAINER = Symbol('my-container');
export const MY_SECOND_CONTAINER = Symbol('my-container');

// Create an orphaned container.
ContainerInstance.of(MY_CONTAINER, null);

// Create a child of the default container.
ContainerInstance.of(MY_SECOND_CONTAINER);
```

### Real-life example of conflict strategies

Consider the following example:

```ts
import { ContainerInstance, Token } from '@typed-inject/injector';

// Keep the container ID local, so other packages have to use
// our function below to create the container.
const VALUE_CONTAINER = Symbol('value');

export const START_TIME = new Token<number>();

function getValueContainer () {
  const container = ContainerInstance.of(VALUE_CONTAINER, null, {
    onConflict: 'null'
  });

  // If we've already created the container, the above call returns null.
  if (container) {
    container.setValue(START_TIME, performance.now());
  }

  // If we've already set up the container, 'container' will be null.
  // However, we still want to return it here, so we re-get it without a conflict strategy.
  return container ?? ContainerInstance.of(VALUE_CONTAINER);
}

// ...

function logEvents () {
  // Get the time when the application started.
  const startTime = getValueContainer().get(START_TIME);
  // ...
}
```

### Dealing with free IDs

In some cases, you may not want a container to be created if the ID isn't in use.

For argument's sake, let's say your application sets up a container with specific values.
A good way to ensure the container is always instantiated correctly can be found below.

Let's tweak our event-logging example above to incorporate the usage of *free strategies* instead.

```ts
import { ContainerInstance, Token } from '@typed-inject/injector';

// Keep the container ID local, so other packages have to use
// our function below to create the container.
const VALUE_CONTAINER = Symbol('value');

export const START_TIME = new Token<number>();

function getValueContainer () {
  // ...
}

// ...

function logEvents () {
  // Get the value container.
  const valueContainer = ContainerInstance.of(VALUE_CONTAINER, null, {
    onFree: 'null'
  });

  if (valueContainer === null) {
    // Oh no! We've forgotten to call `getValueContainer`.
    return;
  }

  // Get the time when the application started.
  const startTime = valueContainer.get(START_TIME);
  // ...
}
```

### Defining a conflict

In some cases, your definition of a conflict may differ from TypeDI's default, which
checks whether another container with the same ID already exists.

In this case, the library helpfully provides a way to define what a conflict *is*.
This is done through [conflict definitions][conflictdefinition-api-ref].

Currently, there are two ways to define a conflict:
  - `'rejectAll'`: This is the default.
  - `'allowSameParent'`: Allow conflicts with containers with the same container to the one provided.

:::note

If you pass a conflict definition without an accompany strategy,
by default, TypeDI will throw an error if a conflict arises.

:::

In the case of `allowSameParent`, if a conflict were to arise, TypeDI would check whether
the parent of the conflicting container matches the one you expected.  If not, the strategy is executed.

Let's look at an example below:

```ts
import { Container } from '@typed-inject/injector';

// Create a child container of the default container.
Container.ofChild('my-new-container');

// Do the same thing again.
Container.ofChild('my-new-container', {
  onConflict: 'throw',
  conflictDefinition: 'allowSameParent'
});
```

In the above example, the second call succeeds, even though the specified ID already exists in the registry.
Without the explicit conflict definition, the above call would throw.

[conflictdefinition-api-ref]: pathname:/api-reference/types/ContainerConflictDefinition.html
[conflictstrategy-api-ref]: pathname:///api-reference/types/ContainerConflictStrategy.html
[creation-opts-api-ref]: pathname:///api-reference/interfaces/CreateContainerOptions.html
[container-of-api-ref]: pathname:///api-reference/classes/ContainerInstance.html#of
[container-of-static-api-ref]: pathname:///api-reference/classes/ContainerInstance.html#of-2
[container-ofchild-api-ref]: pathname:///api-reference/classes/ContainerInstance.html#ofChild














