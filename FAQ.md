# Frequently Asked Questions

## Why does the package not support Node versions under v15.3.0?

That version is the first version to introduce fully-fledged support for ES Modules (see [*Modules: ECMAScript modules*][nodejs-docs-esm]).
It's also [three years old](https://nodejs.org/download/release/v15.3.0/), which provides quite a fair bit of backwards compatibility.

The usage of TypeDI++ with versions *older* than 15.3.0 may be achieved via external packages such as [ESM][npm-esm], though
this would not be an officially supported scenario, and any issues caused as a result of the old Node version would not be fixed.

[nodejs-docs-esm]: https://nodejs.org/docs/latest/api/esm.html
[npm-esm]: https://npmjs.org/esm
