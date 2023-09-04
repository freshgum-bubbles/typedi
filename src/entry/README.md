# Package Entries

This directory contains entry points for the module, which are used
in the `exports` field of the [package.json](../../package.json).

In TypeScript, `.cts` files are emit as `.cjs`, while `.mts` files are
emit as `.mjs`.

This allows us to create two separate entry points: one for versions of
Node where the experimental modules flag has not been enabled, and another
for one which has.



