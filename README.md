# TypeDI<sup>++</sup>

> **Warning**
> From 0.4.0, support for Node versions under 15.3.0 has been removed, as the package has transitioned to ES Modules.

> **Note**
> [Experimental support for Bun has also been introduced](https://github.com/freshgum-bubbles/typedi/commit/f2ec73a6fe1598122cf64f7097a77910fab13560).  Feel free to test and report any issues!

![GitHub](https://img.shields.io/github/license/freshgum-bubbles/typedi) ![npm (scoped)](https://img.shields.io/npm/v/@freshgum/typedi) [![Website](https://img.shields.io/website/https/64a0c6b5de74517c4c7bdb77--singular-praline-356e00.netlify.app.svg?logo=BookStack&label=Documentation&labelColor=177C28)][docs-site] ![Maintenance](https://img.shields.io/maintenance/yes/2023)

_Elegant Dependency Injection in JavaScript and TypeScript._

- `Optional`, `SkipSelf`, `Self`, `Many` support; just like Angular!
- Purely functional injection without any runtime reflection.
- Strict integration with TypeScript.
- Easy testability with the Container-based API.
- Rigorously tested API (nearly 100% coverage!)
- **🔥 10 kB bundle size.** (no dependencies!)

~~(The only thing it can't do is make coffee.)~~

_Dependency Injection in 23 lines:_

```ts
import { Service, Container } from '@freshgum/typedi';

// Make a service that logs a message to the console.
@Service([])
class LogService {
  log(message: string) {
    console.log(message);
  }
}

// Then, use our logging service in our root service,
// which will log "hello world!" to the console.
@Service([LogService])
class RootService {
  // Store the instance of the logger inside the class.
  constructor(private logger: LogService) {}
  run() {
    this.logger.log('hello world!');
  }
}

// Now, run our service!
Container.get(RootService).run();
```

**Congrats!** You've just mastered DI in 23 lines. To learn more,
[check out the documentation][docs-site]!

## License

Released under [MIT](./LICENSE) by [@freshgum](https://github.com/freshgum-bubbles) & [upstream TypeDI contributors](https://github.com/typestack/typedi/blob/develop/LICENSE).

[docs-site]: https://typedi.js.org
