---
sidebar_position: 1
---

# Hello World!

The most basic application you can write is one which logs "Hello World!" and then exits.
To give a basic demonstration of how TypeDI works, this is what we'll be doing today.

To start, you'll want to make sure you've followed the instructions in [Getting Started](../getting-started).
This will make sure you have a functioning environment to test TypeDI in.

:::tip

To run the examples below, you'll also want [ts-node](https://npmjs.org/ts-node) installed.
This will let us run TypeScript code without having to transpile it beforehand.

```sh
$ npm install -g ts-node
```

It's installed globally so it can be run from the command line, like `ts-node main.ts`.

:::

## Creating your First Service

To begin, you'll want to create your `log.service.ts` file, which will contain the application logic to
log messages to the console. We'll then use this service later on to log a message!

```ts title="src/log.service.ts"
import { Service } from '@typed-inject/injector';

@Service([])
export class LogService {
  public log(message: string) {
    console.log(message);
  }
}
```

What we just did there was:

- Declare a service named `LogService`,
- Tell TypeDI it has no dependencies on other services,
- Create a method on the service to log messages.

Dependencies are a core concept of TypeDI, and Dependency Injection in general: _services can depend on other services!_
This lets us abstract our application logic away and place it into a neat little service, which we just did above.

## The Root Service

A typical convention in Dependency Injection is to create a "root service", which initialises other
services and ensures the environment is ready for them. Typically, an application will then call
a method on the root service to run the application.

In our `root.service.ts` file, we'll be doing just that.

```ts title="src/root.service.ts"
import { Service } from '@typed-inject/injector';

@Service([LogService])
export class RootService {
  public constructor(private logger: LogService) {}

  run() {
    this.logger.log('Hello World!');
  }
}
```

We just declared a service named `RootService`, which depends on the `LogService` to log a message to the console.
We've told TypeDI our `RootService` depends on the `LogService` through the `@Service` decorator, which is a fundamental
part of the library. With it, you can declare services with a multitude of different configurations (but we'll get into that later).

## Using the Container

Finally, to put everything together, we'll create a nice `main.ts` file which starts the `RootService` and calls its `run` method.

```ts title="src/main.ts"
import { Container } from '@typed-inject/injector';
import { RootService } from './root.service';

const rootService = Container.get(RootService);
rootService.run();
```

## Running our New App

If you set up `ts-node` as advised above, it'll be as simple as:

```sh
$ ts-node ./src/main.ts
Hello World!
```

I hear the questions already:

> Wait... what? You gave it the name of the class, and it magically created an instance with the required dependencies?
>
> How does that work?

Fear not! How TypeDI works is covered in the [Learning TypeDI](../guide/containers/introduction) section.
