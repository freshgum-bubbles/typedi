# `@typed-inject/injector`

Elegant Dependency Injection in JavaScript and TypeScript.

[**Early documentation available now!**](https://64a0c6b5de74517c4c7bdb77--singular-praline-356e00.netlify.app/)

**This is a fork of [the original TypeDI](https://github.com/typestack/typedi)**.
Quite a lot has changed in this fork. To name a few changes and additions:

- **Resolution constraints**: `Optional`, `SkipSelf`, `Self`, `Many`.  This is very much copied from Angular: you can use them to change the strategy used for resolving a certain dependency of a service.
- Removal of property injection (which is a real anti-pattern) and parameter injection; removed as it isn't a feature in the official decorator spec; therefore, it's at a strong risk of being removed -- see https://github.com/angular/angular/issues/50439.  It's been removed with a more sensible API that has the exact same functionality.
- **Proper container inheritance** through `of` and `ofChild` (and an API for creating containers with no parent)
- **Easier use in JavaScript** through the `JSService` function, without any manual calls to `Container.set` required.
- **ESM bundles** (comes in at 7.9kB for the curious) alongside UMD.
- `getOrNull` and `getManyOrNull` methods for resolving identifiers (alongside the former error-throwing APIs)
- No more passing containers into services unexpectedly and causing runtime errors (re: https://github.com/typestack/typedi/issues/571); *although*... the used container isn't currently attainable anywhere else, I'm definitely looking into that as it is one of my use-cases.
- Investigating disabling eager services by default (see https://github.com/freshgum-bubbles/typedi/pull/17); though they can easily be re-enabled through a method call -- they come with a lot of drawbacks IMO, and can cause some real confusion if you're not careful with them.
- An experimental [**tree visitor API**](https://github.com/freshgum-bubbles/typedi/blob/7004e81cec5152bff75fd4529e29e1f87541bbc1/src/interfaces/tree-visitor.interface.ts) (see https://github.com/freshgum-bubbles/typedi/pull/14) which allows you to traverse containers, child containers, and their respective services from a single object.
- A new work-in-progress documentation website: https://github.com/freshgum-bubbles/typedi/pull/19
- Proposed API change that disables eager services by default for easier testing: https://github.com/freshgum-bubbles/typedi/pull/17
- Addition of a `Container.setValue` method that makes it easier to set string & Token keys: https://github.com/freshgum-bubbles/typedi/pull/30
- `HostContainer`, to allow services to get the container they're running under: https://github.com/freshgum-bubbles/typedi/pull/26
- Lazy references to services, through `LazyReference`, to replace the old function-based API
- Type-checking for dependencies of services, WIP: https://github.com/freshgum-bubbles/typedi/issues/32
- A more strict testing suite to prevent regressions in API functionality, partly helped by https://github.com/freshgum-bubbles/typedi/pull/31
- Cleaning up some dead code in the project.
- Some *proper* **documentation** on the way; I always felt really let down by TypeDI's docs.
- An actively maintained project 😉 

![Build Status](https://github.com/typestack/typedi/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/typestack/typedi/branch/master/graph/badge.svg)](https://codecov.io/gh/typestack/typedi)
[![npm version](https://badge.fury.io/js/typedi.svg)](https://badge.fury.io/js/typedi)
[![Dependency Status](https://david-dm.org/typestack/typedi.svg)](https://david-dm.org/typestack/typedi)
