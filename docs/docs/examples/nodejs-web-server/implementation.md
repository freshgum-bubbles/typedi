---
sidebar_position: 2
sidebar_class_name: sidebar_doc_incomplete
---

# NodeJS Web Server

In [the Services section](../../guide/services/introduction), we talk about an implementation
of a simple web server in TypeDI, through NodeJS and TypeScript.

The server would declare the following services:

- `DatabaseService`, for handling connections to the app's database.
- `WebServerService`, which would handle the instantiation and management of your web server.

In this example, we're going to look at implementing that server.

:::tip

To run the examples below, you'll also want [ts-node](https://npmjs.org/ts-node) installed.
This will let us run TypeScript code without having to transpile it beforehand.

```bash npm2yarn
npm install -g ts-node
```

It's installed globally so it can be run from the command line, like `ts-node main.ts`.

:::

## Creating our Web Server Service

The main part of our application is going to consist of a web-server and, as such,
that's what we're going to implement first.

To start, let's create a `webserver.service.ts` which contains the logic for deploying the server,
responding to requests, and closing the server.

```ts title="src/webserver.service.ts"
import { Service } from '@freshgum/typedi';
import http, { Server, IncomingMessage, ServerResponse } from 'http'; // Node's HTTP module.

@Service([])
export class WebServerService {
  private server!: Server;

  async startServer() {
    if (this.server?.listening) {
      return null;
    }

    const server = this.createServer();

    // Listen for connections on port 8080.
    // Make sure this isn't taken when you run the example!
    return server.listen(8080);
  }

  protected createServer() {
    return http.createServer((request, response) => this.handleRequest(request, response));
  }

  protected handleRequest(request: IncomingMessage, response: ServerResponse<IncomingMessage>) {
    switch (request.url) {
      case '/hello':
        response.writeHead(200);
        response.end('Hello!');
        break;

      default:
        response.writeHead(404);
        response.end('Not Found');
        break;
    }
  }
}
```

The `WebServerService` supports the creation of the server and management of requests.
This lets it respond to HTTP requests from users.

This is a good start, _but we're not done yet..._

## Creating our `RootService`

To make our example run, we'll need something called a _root service_.
This service will depend on our web server and start it.

:::note

While not explicitly required, the root service pattern is recommended for applications.
It keeps your application initialisation code inside the context of a DI container, with
as little as possible outside it.

:::

```ts title="src/root.service.ts"
import { Service, Container } from '@freshgum/typedi';
import { WebServerService } from './webserver.service';

@Service([WebServerService])
export class RootService {
  constructor(private webServer: WebServerService) {}

  async bootstrap() {
    return this.webServer.startServer();
  }
}

// If we're being run as "$ ts-node root.service.ts", start the server automatically.
if (require.main === module) {
  const rootService = Container.get(RootService);
  rootService.bootstrap().then(() => console.log('Web server online!'));
}
```

**Let's run our app!** Run the following code:

```sh
$ ts-node ./root.service.ts
```

Now, navigate to `http://localhost:3000/hello` and examine your work :-)

## Adding a database

As with any modern web application, we'll need a way to store inputs from users and then
output them at a later date. To do this, we'll be using a database.

:::note

_This section is skippable._

**We won't be setting up a database here.** The example below makes use of a map to keep the example simple.

:::

We'll achieve this through a service which will read and write to an in-memory database.
To make it easier to migrate to an out-of-process database like SQLite later on, we'll also
make the APIs for reading and writing data asynchronous.

```ts title="src/database.service.ts"
import { Service } from '@freshgum/typedi';

@Service([ ])
export const DatabaseService {
  private _map = new Map<string, string>();

  async read (key: string) {
    this._map.get(key);
  }

  async write (key: string, value: string) {
    this._map.set(key, value);
  }
}
```

### Updating our `WebServerService`

Now we have a database, we can update the web server to read and write values to it.

Let's update our web-server service with two new routes: one for reading a value, and another for writing it.

```ts title="src/webserver.service.ts"
// ...
// highlight-revision-start
import { DatabaseService } from './database.service';
// highlight-revision-end

// highlight-revision-start
@Service([DatabaseService])
// highlight-revision-end
class WebServerService {
  // ...

  // highlight-revision-start
  constructor(private database: DatabaseService) {}
  // highlight-revision-end

  protected handleRequest(request: IncomingMessage, response: ServerResponse<IncomingMessage>) {
    // highlight-revision-start
    const { searchParams: params } = new URL(request.url ?? '');
    // highlight-revision-end

    switch (request.url) {
      case '/hello':
        response.writeHead(200);
        // highlight-revision-start
        this.database.get('name').then(name => {
          response.end(`Hello, ${name ?? 'unknown person'}!`);
        });
        // highlight-revision-end
        break;

      case '/setname':
        response.writeHead(200);
        // highlight-revision-start
        this.database.set('name', params.name).then(() => {
          response.end(`Hello, ${params.name}!`);
        });
        // highlight-revision-end
        break;

      default:
        response.writeHead(404);
        response.end('Not Found');
        break;
    }
  }
  // ...
}
```

Now, we've got a functioning web-server which can store the user's name in memory.
Try running the updated version, like so:

```sh
$ ts-node ./root.service.ts
```

Now, when we tell the server our name with `http://localhost:3000/setname?name=Joe`,
the `/hello` endpoint will address you by name! 🎉

<!--
TODO: in testing section, show why http.Server call was bad
TODO: in testing section, show how to test
TODO: say adding further routes to a Map is left as an exercise for the reader
TODO: make TypeScript interface showing what our WebServerService's interface is
TODO: add edit links (see markdown front matter docs for howto)
TODO: proper head metadata for pages
-->

##
