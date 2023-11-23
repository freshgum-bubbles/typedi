<div align="center">
  <h1>TypeDI<sup>++</sup></h1>
  <p>Elegant dependency injection in TypeScript and JavaScript.</p>

  ![GitHub](https://img.shields.io/github/license/freshgum-bubbles/typedi) ![npm (scoped)](https://img.shields.io/npm/v/@freshgum/typedi) [![Website](https://img.shields.io/website/https/64a0c6b5de74517c4c7bdb77--singular-praline-356e00.netlify.app.svg?logo=BookStack&label=Documentation&labelColor=177C28)][docs-site] ![Maintenance](https://img.shields.io/maintenance/yes/2023)
</div>

> [!WARNING]
> From 0.4.0, support for Node versions under v15.3.0 has been removed, as the package has transitioned to ES Modules.
>
> <sup>See [_Why does the package not support Node versions under v15.3.0?_][pkg-faq-node-15-3-0].</sup>

> [!NOTE]
> [Experimental support for Bun has also been introduced](https://github.com/freshgum-bubbles/typedi/commit/f2ec73a6fe1598122cf64f7097a77910fab13560). Feel free to test and report any issues!

## Features

- [`Optional`, `SkipSelf`, `Self`, `Many`][docs-site-constraints] and more, just like Angular!
- 100% functional injection, without any runtime reflection (no more `reflect-metadata`!)
- **10kB bundle size, and no dependencies.**
- Simplify testing across your entire app, with a simple suite of injection tools to get you started.
- Rigorously tested, type-safe API.

## Get Started

To start, you'll want to install the NPM package as part of your project.

```sh
$ npm install @freshgum/typedi
```

After that, you should be good to go.  Read the [documentation][docs-site] to get started!

## Quick Example

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

## Project Goals

Some goals of the project include:

- **To keep things simple**: Containers are essentially type-safe `Map` instances, with smarts for resolving dependencies, managing container hierarchies, resolving constraints, and some additional functionality.
- **Avoid reinventing the wheel**: I could bundle an endless amount of code in this package, but I'd rather not -- instead, let's allow this project to focus on one thing and execute it well, as opposed to doing hundreds of things badly.
- **Have a minimal presence in bundles**: As it stands, the production builds of this project are around 10kB.  Other libraries tend to be much larger, which typically leads to a lot of unused functionality and slower loading times on constrained network connections.
- **Extensibility**: The container, and all other parts of the package, should be extendable by the consumer, instead of forcing everyone into a pre-defined workflow.  However, steps are taken to ensure that the consumer is guided into making The Right Decision<sup>(tm)</sup> when not doing so would be harder to manage.
- **To allow for opaque implementations**: The package should avoid using global state where possible (aside from the default container, of course), to prevent libraries using the package from conflicting with end-user code.
- **Avoid breaking end-user code**: As the package is sub-v1, this isn't as much of a priority right now; however, very few breaking changes are introduced, and the changes that *are* made are typically made for good reasons (and are documented in the changelog.).  Unnecessarily breaking end-user code is pointless, frustrating, and causes work for everyone.
- **Make it easy to create well-defined, stable interfaces**: Currently, this is done through simply using service classes.  Instances of said classes can then be attained and used as regular instances.
- **Avoid magical syntax, in favour of easy, simple syntax**: Avoid using "magic" when doing so would be unnecessary, and would obfuscate what the code does to anyone not familiar with this container implementation.
- **Do one thing, and do it well**.

This container was initially made for my own use in code, though I will happily take suggestions, issues and feature requests to improve it.

## "Why was this created?"

It's mainly a more modern, simpler version of the original [TypeDI project](https://github.com/typestack/typedi), with more features, easier integration, and better error reporting.

## (Un)ideal Naming

In the future, I'll most likely look at renaming this package.  That'll come naturally as part of a wider project.  You'll probably notice that I avoid explicitly using this package's name in a lot of places; that will make it easier to update.  The naming scheme is... unfortunate, and in retrospect I should have named it differently to avoid confusion with the original project.

## Maintenance

<img src="./assets/this-is-fine-meme.png" width="150px" />

Yes.  I regularly use it as part of my packages.  However, bear in mind that, as the goal of this package is to do one thing well, there may not be updates for periods if they are not explicitly required, or if the addition of further functionality would go against the project goals.

However, I will happily review any MRs made against the source tree.  If you wish to suggest a feature, I would prefer it if you could open an issue first to discuss whether the feature is appropriate, and whether its implementation is feasible.

## License

Released under [MIT](./LICENSE) by [@freshgum](https://github.com/freshgum-bubbles) & [upstream TypeDI contributors](https://github.com/typestack/typedi/blob/develop/LICENSE).

[pkg-faq-node-15-3-0]: ./FAQ.md#why-does-the-package-not-support-node-versions-under-v1530
[docs-site]: https://typedi.js.org
[docs-site-constraints]: https://typedi.js.org/docs/guide/services/resolution-constraints
