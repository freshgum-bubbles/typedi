# TypeDI<sup>++</sup>

![GitHub](https://img.shields.io/github/license/freshgum-bubbles/typedi) ![npm (scoped)](https://img.shields.io/npm/v/@typed-inject/injector) [![Website](https://img.shields.io/website/https/64a0c6b5de74517c4c7bdb77--singular-praline-356e00.netlify.app.svg?logo=BookStack&label=Documentation&labelColor=177C28)](https://64a0c6b5de74517c4c7bdb77--singular-praline-356e00.netlify.app/) ![Maintenance](https://img.shields.io/maintenance/yes/2023)

*Elegant Dependency Injection in JavaScript and TypeScript.*

- `Optional`, `SkipSelf`, `Self`, `Many` support; just like Angular!
- Purely functional injection without any runtime reflection.
- Strict integration with TypeScript.
- Easy testability with the Container-based API.
- Rigorously tested API (nearly 100% coverage!)
- **🔥 10 kB bundle size.** (no dependencies!)

~~(The only thing it can't do is make coffee.)~~

*Dependency Injection in 23 lines:*

```ts
import { Service, Container } from '@typed-inject/injector';

// Make a service that logs a message to the console.
@Service([ ])
class LogService {
    log (message: string) {
        console.log(message);
    }
}

// Then, use our logging service in our root service,
// which will log "hello world!" to the console.
@Service([LogService])
class RootService {
    // Store the instance of the logger inside the class.
    constructor (private logger: LogService) { }
    run () {
        this.logger.log("hello world!");
    }
}

// Now, run our service!
Container.get(RootService).run();
```

**Congrats!** You've just mastered DI in 23 lines. To learn more,
[check out the documentation](https://64a0c6b5de74517c4c7bdb77--singular-praline-356e00.netlify.app/)!

## License

Released under [MIT](./LICENSE) by [@freshgum](https://github.com/freshgum-bubbles) & [upstream TypeDI contributors](https://github.com/typestack/typedi/blob/develop/LICENSE).

