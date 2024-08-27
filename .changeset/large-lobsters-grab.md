---
'@freshgum/typedi': minor
---

The `lazy` function has been renamed to `forwardRef`.

In retrospect, the name of this function didn't clearly
describe its purpose, which is to break cyclic dependency
chains at the service initialization stage.

The renaming of this function to `forwardRef` more clearly
explains its function.  The name was 1:1 inspired by Angular,
which contains a function that does exactly the same thing.

Note that, while `lazy` is deprecated, it will still be supported.
The implementation of the `lazy` function has been moved to
`forwardRef`, which is a 1:1 replacement for the former.