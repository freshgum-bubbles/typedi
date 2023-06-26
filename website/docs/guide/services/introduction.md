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

To see what the above server would look like when implemented in TypeDI, check out the [NodeJS Web Server](../../examples/nodejs-web-server) example.

:::

Each service manages *one* part of the application.

Additionally, each service abstracts away implementation logic.
For example, if your application makes use of PostgreSQL now, it is most
likely possible that you can change the underlying database implementation within `DatabaseService`
to support a different database, such as MySQL.

TypeDI lets you express services through an expressive decorator-based syntax, which allows you to:
  - Declare any neighbouring services a service depends on
  - Store implementation logic in an easily-readable ES6 class format



[di-demystified-by-james-shore]: https://www.jamesshore.com/v2/blog/2006/dependency-injection-demystified
[di-demystified-by-james-shore-archive]: https://web.archive.org/web/20230208150338/https://www.jamesshore.com/v2/blog/2006/dependency-injection-demystified
[injection-by-martin-fowler]: https://martinfowler.com/articles/injection.html
[injection-by-martin-fowler-archive]: https://web.archive.org/web/20230406045635/https://martinfowler.com/articles/injection.html
