---
sidebar_position: 1
---

# Services

Services are one of the core concepts of Dependency Injection.
Each service has a certain responsibility and, when each service is
brought together, they power the functionality of your project.

:::note

**This page doesn't aim to be an introductory guide to Dependency Injection.**

If you're new to the concept, here are some recommended learning resources:
  - [*"Dependency Injection Demystified"* by James Shore][di-demystified-by-james-shore] <sup>[(archive)][di-demystified-by-james-shore-archive]</sup>
  - [*"Inversion of Control Containers and the Dependency Injection pattern"* by Martin Fowler][injection-by-martin-fowler] <sup>[(archive)][injection-by-martin-fowler-archive]</sup>

:::

In your typical NodeJS app, you may have the following services:
  - `DatabaseService`, for handling connections to the app's database.
  - `WebServerService`, which would handle the instantiation and management of your web server.
  - `DiagnosticsService`, allowing for sending diagnostics to a central service.

:::tip

To see what the above server would look like when implemented in TypeDI, check out the [NodeJS Web Server](../../examples/nodejs-web-server/implementation) example.

:::

**Each service manages *one* part of the application.**

Additionally, each service abstracts away implementation logic.
For example, if your application makes use of PostgreSQL now, it is most
likely possible that you can change the underlying database implementation within `DatabaseService`
to support a different database, such as MySQL.

TypeDI lets you express services through an expressive decorator-based syntax, which allows you to:
  - Declare any neighbouring services a service depends on
  - Store implementation logic in an easily-readable ES6 class format
  - Provide a public interface for consumers of your service

Let's put that into practice, while also exploring the various ways you can tweak the declaration
of services to meet various use-cases you may require in your app.

## Attaching to Containers

By default, services are attached to the [default container](../containers).
However, we can tweak this behaviour by introducing an **options object** to the `@Service` decorator.
Let's explore how our [Hello World!](../../examples/hello-world) example could be changed to bind the
service to a different container.

```ts title="src/log.service.ts"
import { Service, Container } from '@typed-inject/inject';

// highlight-revision-start
export const container = Container.ofChild("my-new-container");
// highlight-revision-end

// highlight-revision-start
@Service({ container }, [ ])
// highlight-revision-end
export class LogService {
    public log (message: string) {
        console.log(message);
    }
}
```

What we did there was add an *options object* to our service declaration. This gives TypeDI certain
instructions on how & why the service should be initialised.  In our case, we only changed the container.

## Finding our Service

As we've now moved the `LogService` to a different container, the following will no longer work:

```ts title="src/main.ts"
import { Container } from '@typed-inject/inject';
import { LogService } from './log.service';

// highlight-next-line-error
const logger = Container.get(LogService);
// highlight-error-comment-start
//             ^^^^^^^^^^^^^
//             ServiceNotFoundError: 
//               Service with "LogService" identifier was not found in the container. 
// highlight-error-comment-end
```

This is because containers don't search *upwards*.  This is covered in [the Containers guide](../containers/inheritance).

Instead, what we have to do is use our newly-created container to find the service. Let's update our code above.

```ts title="src/main.ts"
import { Container } from '@typed-inject/inject';
// highlight-revision-start
import { LogService, container } from './log.service';
// highlight-revision-end

// highlight-revision-start
const logger = container.get(LogService);
// highlight-revision-end
```

Perfect!

## Creating Instances via Factories

In some cases, you'll want to create a service via a function instead of have TypeDI create it for you.
For these cases, the `Service` decorator allows you provide a factory function, which TypeDI will
use instead of the `new` operator to create an instance of your service.  


XXX

[di-demystified-by-james-shore]: https://www.jamesshore.com/v2/blog/2006/dependency-injection-demystified
[di-demystified-by-james-shore-archive]: https://web.archive.org/web/20230208150338/https://www.jamesshore.com/v2/blog/2006/dependency-injection-demystified
[injection-by-martin-fowler]: https://martinfowler.com/articles/injection.html
[injection-by-martin-fowler-archive]: https://web.archive.org/web/20230406045635/https://martinfowler.com/articles/injection.html
