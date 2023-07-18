---
sidebar_position: 5
---

# Singletons

Sometimes, you'll want a service to only be created once.
This might be when it has side-effects, such as creating a web server.

TypeDI supports this use-case by allowing individual services to be marked as singletons.
When they are, only one instance of them will _ever_ be created over the lifetime of the application.

:::tip

Singletons are attached to the globally-available default container.
This means that, regardless of the container which resolves them,
the same value will always be returned.

:::

Singletons are created very similarly to ordinary services, with one extra configuration parameter that must be declared.

As an example, let's create services for an application that hosts a web server.
We'd only want that web server to be created once, so we'd mark it as a singleton.

```ts title="src/webserver.service.ts"
import { Service } from '@typed-inject/injector';
import http from 'http'; // Node's HTTP module

@Service(
  {
    // highlight-revision-start
    singleton: true,
    // highlight-revision-end
  },
  []
)
export class WebServerService {
  private server: http.Server;
  startServer() {
    this.server = http.createServer((request, response) => {
      response.write('Hello world!');
      response.end();
    });

    this.server.listen(3000);
  }
}
```

Once we've done that, we can then start the web server in our root service.

```ts title="src/root.service.ts"
import { Service } from '@typed-inject/injector';
import { WebServerService } from './webserver.service';

@Service([WebServerService])
export class RootService {
  constructor(private webServer: WebServerService) {}

  bootstrap() {
    this.webServer.startServer();
  }
}
```

Now, any services which use the web-server as a dependency, regardless of if they
are child containers, will always refer to that same web server instance.
This prevents multiple web servers from being started at once.

:::tip

**Utilising singletons for run-once operations is broadly considered a good idea.**

In the case of our demo application, if multiple web server instances were to start,
you would experience runtime errors as only one server can be hosted on a port at a time.

On the contrary, TypeDI also supports [creating _multiple_ instances of a service](./multiple-services.md).

:::
