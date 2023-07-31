---
sidebar_position: 1
---

# Tokens

In TypeDI, tokens can be used to create a reference to a static value inside the container.
They can then be injected into services as regular dependencies.

As an example, let's update our [Hello World!](../../examples/hello-world) example to
print the value of a token instead of a hard-coded string.

## Creating our Token

First, we'll create a file which holds the token.

```ts src="app/message.token.ts"
import { Token } from '@typed-inject/injector';

// highlight-revision-start
export const MESSAGE = new Token<string>('The message to print to the console.');
// highlight-revision-end
```

In TypeDI, tokens are created by making new instances of the `Token` class.
It also accepts a type parameter, which sets the type of the value the token points to.
Finally, a message is also accepted, which is used for debugging purposes within TypeDI.

:::tip

As with services, it's good practice to name your files according to what they contain.
As this file centres around exporting a token, we add a ".token.ts" suffix to the file name.

:::

## Consuming our Token

Let's now update our logging service to print the value of the token.

```ts src="app/log.service.ts"
import { Service } from '@typed-inject/injector';
import { MESSAGE } from './message.token';

// highlight-revision-start
@Service([MESSAGE])
// highlight-revision-end
export class LogService {
  // highlight-revision-start
  constructor(private message: string) {}
  // highlight-revision-end

  public log() {
    console.log(this.message);
  }
}
```

What we've done is update our `LogService` to consume the newly-created token as a dependency.
Before we've created our container, TypeDI doesn't know what the value of the token is.

## Setting the value of a Token

We'll now need to tell TypeDI what the value of `MESSAGE` should be before we create
our `LogService`.

:::note

For brevity, the `RootService` service in the example is skipped here.

:::

```ts title="src/main.ts"
import { Container } from '@typed-inject/injector';
import { LogService } from './log.service';
import { MESSAGE } from './message.token';

// highlight-revision-start
Container.set({ id: MESSAGE, value: 'Hello World!', dependencies: [] });
// highlight-revision-end

Container.get(LogService).log();
```

If we now run our code, we'll see the following:

```sh
$ ts-node ./src/main.ts
Hello World!
```

:::tip Did you know...

In TypeDI, tokens aren't treated specially. In fact, the implementation of `Token` is quite literally:

```ts
export class Token<T> {
  constructor(public name?: string) {}
}
```

:::
