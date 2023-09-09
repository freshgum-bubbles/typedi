# Contributions

This folder contains additional functionality for `@freshgum/typedi`.

While these features are useful, they are not included in the main package exports -- this is due to them not being required for the majority of users.  

Instead, they are packaged here and can be imported like so:

```ts
import { Feature } from '@freshgum/typedi/contrib/feature';
```

## *"Why not `features/`?"*

The term "features" is already used in other parts of the project.  For instance, [the test directory](../../test/) contains a features directory, which tests functionality added to the core project as a result of the fork.

Therefore, be aware that, unlike many other projects, files here are not guaranteed to be written by external contributors -- they are also subject to the same maintenance and testing as the package's core functionality.

## License

These files adhere to the same license as the main package, a copy of which can be attained via [the `LICENSE` file](../../LICENSE).