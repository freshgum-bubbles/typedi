---
sidebar_position: 3
---

# ES Decorators

TypeScript users have long been accustomed to the `experimentalDecorators` option, which
has allowed for the use of a TypeScript-specific decorator API.  However, **this is changing**.

Without delving into an extreme amount of detail [(Axel R.'s blog does that very well)][axel-r-decorators],
as of 10/18/2023, decorators have now been standarized as part of the TC39 process.

TypeScript 5.0 [introduced support for this new decorator API][ts-blog-5.0-release-decorators],
and packages have slowly begun transitioning to it.  It's now considered stable, so support
for it has been added to the TypeDI++ project ([as of v0.7.0][gh-project-changelog]) as part of a contributory package.

## Example

:::note

To use these decorators, you'll need to **disable the `experimentalDecorators` option in your `tsconfig.json`**,
and migrate your usage of the `Service` decorator to the `ESService` decorator provided in `@freshgum/typedi/contrib/es`.

:::

As a quick example of the above:

```ts
import { ESService } from '@freshgum/typedi/contrib/es';

@ESService([ ])
export class MyService { }
```

## Legacy Decorators

For backwards compatibility, the usage of legacy decorators is still supported.
There's no immediate need to migrate to the new API.

However, documentation will be updated to encourage usage of ES Decorators,
as the TypeScript team will (most likely) eventually remove support for these decorators.

[ts-blog-5.0-release-decorators]: https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/#decorators
[axel-r-decorators]: https://2ality.com/2022/10/javascript-decorators.html
[gh-project-changelog]: https://github.com/freshgum-bubbles/typedi/blob/develop/CHANGELOG.md