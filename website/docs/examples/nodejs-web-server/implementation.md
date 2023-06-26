---
sidebar_position: 2
---

# NodeJS Web Server

In [the Services section](../guide/services/introduction), we talk about an implementation
of a simple web server in TypeDI, through NodeJS and TypeScript.

The server would declare the following services:
  - `DatabaseService`, for handling connections to the app's database.
  - `WebServerService`, which would handle the instantiation and management of your web server.
  - `DiagnosticsService`, allowing for sending diagnostics to a central service.

In this example, we're going to look at implementing that server.
To simplify implementation, we'll be excluding the `DiagnosticsService` for now.

:::tip

To run the examples below, you'll also want [ts-node](https://npmjs.org/ts-node) installed.
This will let us run TypeScript code without having to transpile it beforehand.

```sh
$ npm install -g ts-node
```

It's installed globally so it can be run from the command line, like `ts-node main.ts`.

:::

## Creating our Web Server Service

The main part of our application is going to consist of a web-server and, as such,
that's what we're going to implement first.

To start, let's create a `webserver.service.ts` which contains the logic for deploying the server,
responding to requests, and closing the server.

```ts title="src/webserver.service.ts"
import { Service } from '@typed-inject/inject';
import http, { Server } from 'http'; // Node's HTTP module.

@Service([ ])
export class WebServerService {
  private server!: Server;

  startServer () {
    if (this.server?.listening) {
      return false;
    }

    const server = this.createServer();

    // Listen for connections on port 8080.
    // Make sure this isn't taken when you run the example!
    server.listen(8080);

    return true;
  }

  protected createServer () {
    return http.createServer(
      (request, response) => this.handleRequest(request, response)
    );
  }

  protected handleRequest (request: http.Request, response: http.Response) {
    switch (response.url) {
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

<!--
TODO: in testing section, show why http.Server call was bad
TODO: in testing section, show how to test
TODO: say adding further routes to a Map is left as an exercise for the reader
TODO: make TypeScript interface showing what our WebServerService's interface is
TODO: add edit links (see markdown front matter docs for howto)
TODO: proper head metadata for pages
-->

## 