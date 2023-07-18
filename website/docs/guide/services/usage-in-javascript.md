---
sidebar_position: 6
---

# Usage in JavaScript

TypeDI is primarily developed for use in TypeScript.
However, to make it _easier_ to make use of it in JavaScript, a `JSService` function is provided.

As an example of how to use it, let's tweak the logging service we made in the [Hello World! example](../../examples/hello-world.md):

```js title="src/log.service.js"
import { JSService } from '@typed-inject/injector';

export const LogService = JSService(
  [],
  class LogService {
    log(message) {
      console.log(message);
    }
  }
);
```

```ts title="src/root.service.js"
import { Service } from '@typed-inject/injector';

export const RootService = JSService(
  [LogService],
  class RootService {
    public constructor(private logger) {}

    run() {
      this.logger.log('Hello World!');
    }
  }
);
```

:::caution

As with `Service`, don't forget to place any dependencies your service requires in the array.
Otherwise, TypeDI won't know your service requires them, and won't pass them in as arguments.

:::

As you can see, the API is quite similar to its TypeScript-friendly equivalent.
With our changes, the example above will run in plain JavaScript with no problems.

**But we're not done yet**.

## `JSService` type

In the examples above, TypeScript doesn't interpret each service as a class. That means the following will fail:

```ts title="src/example.ts"
import { LogService } from './log.service';
// highlight-next-line-error
const logService: LogService = new LogService();
// highlight-error-comment-start
//    ^^^^^^^^^^
//    'LogService' refers to a value, but is being used as a type here. Did you mean 'typeof MyService'?
// highlight-error-comment-end
```

If you're type-checking JavaScript with TypeScript, that can quickly become a problem.
That's where the `JSService` _type_ comes in.

Cleverly, the `JSService` import is actually _two_ imports: one for the function implementation, and another for a type.
The type allows you to wrap the service in the type to elide type errors, like so:

```ts title="src/example.ts"
import { JSService } from '@typed-inject/injector';
import { LogService } from './log.service';

const logService: JSService<typeof LogService> = new LogService();
```

:::note

Unfortunately, due to a limitation in TypeScript, it's not currently possible to export the equivalent `JSService`-wrapped
type from a `.js` file. See [microsoft/TypeScript#48104](https://github.com/microsoft/TypeScript/issues/48104).

:::

## Function classes

The `JSService` function also supports functional classes as opposed to ES6 ones.

This lets us take advantage of TypeDI in ES5 environments without any transpilation steps.

As an example, let's change the `LogService` we made above to the following:

```js title="src/log.service.js"
import { JSService } from '@typed-inject/injector';

export const LogService = JSService([], function LogService() {});

LogService.prototype.log = function (message) {
  console.log(message);
};
```

We've now moved our methods outside of the main call to `JSService`.
Instead, they reside below it.

:::info

It's generally recommended to use ES6 classes wherever possible, as they provide
a better experience in editors such [Visual Studio Code](https://code.visualstudio.com/). The example above might need additional typing in adjacent `.d.ts` files.

As of currently, the methods in the above service are not automatically inferred by
TypeScript. Therefore, when used, they are of type `any`.

:::
