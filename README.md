<div align="center">
  <h1>TypeDI<sup>++</sup></h1>
  <p>Elegant dependency injection in TypeScript and JavaScript.</p>

[![MIT License](https://img.shields.io/github/license/freshgum-bubbles/typedi)][pkg-license-file] [![npm (scoped)](https://img.shields.io/npm/v/@freshgum/typedi)][pkg-npm] [![Website](https://img.shields.io/website/https/64a0c6b5de74517c4c7bdb77--singular-praline-356e00.netlify.app.svg?logo=BookStack&label=Documentation&labelColor=177C28)][docs-site] [![Maintenance](https://img.shields.io/maintenance/yes/2023)](#maintenance)

</div>

<!-- prettier-ignore -->
> [!WARNING]
> From 0.4.0, support for Node versions under v15.3.0 has been removed, as the package has transitioned to ES Modules.
>
> <sup>See [Why does the package not support Node versions under v15.3.0?][pkg-faq-node-15-3-0]</sup>

<!-- prettier-ignore -->
> [!NOTE]
> [Experimental support for Bun has also been introduced](https://github.com/freshgum-bubbles/typedi/commit/f2ec73a6fe1598122cf64f7097a77910fab13560). Feel free to test and report any issues!

## Features

- [`Optional`, `SkipSelf`, `Self`, `Many`][docs-site-constraints] and more, just like Angular!
- 100% functional injection, without any runtime reflection (no more `reflect-metadata`!)
- **10kB bundle size[^1] (3.8k gzip'd[^9]), and no dependencies[^2].**
- Simplify testing across your entire app, with a simple suite of injection tools to get you started[^3].
- Rigorously tested, type-safe API[^4].

## Get Started

To start, you'll want to install the NPM package as part of your project.

```sh
$ npm install @freshgum/typedi
```

After that, you should be good to go. Read the [documentation][docs-site] to get started!

## Quick Example

```ts
import { Service, Container, Token } from '@freshgum/typedi';

// Make a service that logs a message to the console.
type LogFunction = (...args: any[]) => void;
const LOG_FUNCTION = new Token<LogFunction>();

@Service([LOG_FUNCTION])
class LogService {
  constructor (private logFn: LogFunction) { }

  log(message: string) {
    this.logFn(message);
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

// Set the logging function...
Container.set(LOG_FUNCTION, console.log);

// Now, run our service!
Container.get(RootService).run();
```

## Runtime Support

This DI implementation doesn't require any sort of precompilation / bundler steps, aside from the usual one provided by your TypeScript compiler.

## Project Goals

Some goals of the project include:

1. **To keep things simple**: Containers are essentially type-safe `Map` instances, with smarts for resolving dependencies, managing container hierarchies, resolving constraints, and some additional functionality.
2. **Avoid reinventing the wheel**: I could bundle an endless amount of code in this package, but I'd rather not -- instead, let's allow this project to focus on one thing and execute it well, as opposed to doing hundreds of things badly.
3. **Have a minimal presence in bundles**: As it stands, the production builds of this project are around 10kB. Other libraries tend to be much larger, which typically leads to a lot of unused functionality and slower loading times on constrained network connections.
4. **Extensibility**: The container, and all other parts of the package, should be extendable by the consumer, instead of forcing everyone into a pre-defined workflow. However, steps are taken to ensure that the consumer is guided into making The Right Decision<sup>(tm)</sup> when not doing so would be harder to manage.
5. **To allow for opaque implementations**: The package should avoid using global state where possible (aside from the default container, of course), to prevent libraries using the package from conflicting with end-user code.
6. **Avoid breaking end-user code**: As the package is sub-v1, this isn't as much of a priority right now; however, very few breaking changes are introduced, and the changes that _are_ made are typically made for good reasons (and are documented in the changelog.). Unnecessarily breaking end-user code is pointless, frustrating, and causes work for everyone.
7. **Make it easy to create well-defined, stable interfaces**: Currently, this is done through simply using service classes. Instances of said classes can then be attained and used as regular instances.
8. **Avoid magical syntax, in favour of easy, simple syntax**: Avoid using "magic"[^7] when doing so would be unnecessary, and would obfuscate what the code does to anyone not familiar with this container implementation.
9. **Encompass isomorphism.**: Some other DI implementations access Node-specific APIs (e.g. the filesystem); we don't want to do that here. Instead of tying the library to a specific runtime, or set of libraries, **this implementation aims to be compatible across different bundlers, ecosystems, runners, and more**. However, we can't explicitly guarantee compatibility with runtimes we don't personally use; if you think we've missed something, however, please open an issue.
10. **Do one thing, and do it well**. Regarding filesystems, we've _specifically_ made a note of avoiding doing anything like that here; it's fragile, hard to debug, and generally becomes an annoyance as a project scales, files are moved, and paths have to be continually updated. Instead of that, regular `import` statements are used; this dramatically simplifies any required refactoring work, and general maintenance of consumer code.

This container was initially made for my own use in code, though I will happily take suggestions, issues and feature requests to improve it.

## Project Non-Goals

_These will be added if any features are requested that are not compatible with the project goals._

## "Why was this created?"

It's mainly a more modern, simpler version of the original [TypeDI project](https://github.com/typestack/typedi), with more features, easier integration, and better error reporting. The naming isn't ideal, and it'll most likely be changed in the future[^5].

## Maintenance

<img src="./assets/this-is-fine-meme.png" width="150px" />

Yes. I regularly use it as part of my packages (and so do others!)[^6]. I didn't put in all this effort just to abandon the project. However, bear in mind that, as the goal of this package is to do one thing well, there may not be updates for periods if they are not explicitly required[^8], or if the addition of further functionality would go against the project goals.

However, I will happily review any MRs made against the source tree. If you wish to suggest a feature, I would prefer it if you could open an issue first to discuss whether the feature is appropriate, and whether its implementation is feasible.

## License

Released under [MIT](./LICENSE) by [@freshgum](https://github.com/freshgum-bubbles) & [upstream TypeDI contributors](https://github.com/typestack/typedi/blob/develop/LICENSE).

[pkg-faq-node-15-3-0]: ./FAQ.md#why-does-the-package-not-support-node-versions-under-v1530
[docs-site]: https://typedi.js.org
[docs-site-constraints]: https://typedi.js.org/docs/guide/services/resolution-constraints
[pkg-vcs]: https://github.com/freshgum-bubbles/typedi
[pkg-npm]: https://npmjs.org/@freshgum/typedi

<!-- Direct file link to ensure compatibility across local / NPM / GitHub views. -->

[pkg-license-file]: ./LICENSE

<!--
  All these footnotes make the README look like one of Apple's promotional pages...

  P.S. Future maintainers: these footnotes are in order of *addition*, not appearance throughout the document.
  The ordering doesn't really matter anyway, as GitHub automatically sorts them in order of appearance (or so it seems).
-->

[^1]: **Tested on 23/11/2023**. [A lot of work](https://github.com/search?q=repo%3Afreshgum-bubbles%2Ftypedi+bundle+size&type=commits) is made to reduce the size of the bundle _(a lot of work has also been inlined into other, non-related commits)_. Note that bundle size tests are performed by copying the minified `typedi.min.mjs` file into [ByteSizeMatters](https://freshgum-bubbles.github.io/bytesizematters/) -- there are most likely better ways to test this. Investigation on reducing bundle size is then performed by formatting the minified file with Prettier, and assessing the bundle for unnecessary code / possible refactors; this is done iteratively until I am unable to find any further code size optimizations (which would not negatively affect performance / result in breaking changes). An example of a trick used to reduce the bundle size is name mangling: the [Rollup configuration file](./rollup.config.mjs) contains code to minify certain members of internal classes (such as `VisitorCollection`).
[^2]: No _runtime_ dependencies are included. The only dependency of this package is [type-fest](https://github.com/sindresorhus/type-fest) (which only provides TypeScript types which are used internally). This dependency has been [version-locked](https://github.com/freshgum-bubbles/typedi/blob/develop/package.json) to ensure any breaches of that package's security does not impact anyone using this package. Any updates are checked and verified to ensure they do not contain malicious code.
[^3]: This mainly refers to the package's standard container-based interface, which makes testing easy (as you can replace services and values at any time). Further work is being done on a more featureful testing suite, which would be able to simplify the overall testing process.
[^4]: I haven't counted each one, but I'd say that the package exports ~40 types (as of writing: 23/11/2023); a lot of the safety is provided through typing, as opposed to unnecessary runtime checks, which affect performance and code size.
[^5]: In the future, I'll most likely look at renaming this package. That'll come naturally as part of a wider project. You'll probably notice that I avoid explicitly using this package's name in a lot of places; that will make it easier to update. The naming scheme is... unfortunate, and in retrospect I should have named it differently to avoid confusion with the original project.
[^6]: One example of such a project is [ListenBrainz Discord RPC](https://github.com/freshgum-bubbles/listenbrainz-discord-rpc), which makes use of this package to structure its functionality into modular services. There are some other examples on GitHub's _Dependents_ view, too.
[^7]: An example of "magic", in this context, would be integration with the filesystem to read a configuration file in a proprietary format, and then using that to configure services -- while that might make more sense for Java developers, such features don't (in my experience) scale well in JavaScript. Also, we'd have to write a ton of editor integrations! `</ramble>`
[^8]: If the library is ever feature-complete, **it'll still be maintained** -- compatibility with the latest engines will still be tested. However, as stated prior, features would not be added for the sake of adding features. Therefore, if this package ever _becomes_ feature-complete (and is placed into maintenance mode), **there's no need to ask if it's abandoned.** If I ever become unable to continue maintaining the package, it shall be placed into archival (and the NPM package will become deprecated); in that case, please fork it and continue my efforts. All power to you!
[^9]: Tested via `pnpm run build; cd build/bundles; for file in *.mjs; do printf "$file\t$(cat $file | wc -c | xargs printf "%'d\n")\t$(gzip -9c $file | wc -c | xargs printf "%'d\n")\t$(brotli -cZ $file | wc -c | xargs printf "%'d\n")\n"; done | tee` _(credit: [mrienstra on Stack Overflow](https://stackoverflow.com/a/53870869))_
