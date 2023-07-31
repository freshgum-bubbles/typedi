---
sidebar_position: 2
sidebar_class_name: sidebar_doc_incomplete
---

# Stopping Our App

Our `WebServerService` is pretty smart. It creates a server for us on-demand,
while also handling any requests from users on the server's port.

However, one thing it doesn't do is allow the consumer to shut _down_ the server.
Currently, the only way to do this is to stop the Node.js process altogether.

:::tip

This is an anti-pattern; services should _always_ provide a way to close down
any resources they may create over their lifetime. For example, a service
managing database connections should allow for the closing of connections too.

:::

Let's update our web server service to provide a `shutdown` method, which will
shutdown the active HTTP server.

```ts src="webserver.service.ts"
// ...

@Service([DatabaseService])
class WebServerService {
  // ...
  // highlight-revision-start
  stopServer() {
    if (this.server?.listening) {
      this.server.close();
    }
  }
  // highlight-revision-end
  // ...
}
```
