---
'@freshgum/typedi': patch
---

Dedicated entry-points have been added for web-facing builds <sup>([#184][gh-issue-184])</sup>.
You're now able to use modules from contrib/ without relying on a bundler,
or importing contrib/ packages separately from `/esm5/`.

> [!NOTE] > **The changes made here do not impact current UMD / MJS entry-points.**
>
> If you're using these, you won't experience any changes.
> To make use of contrib/ modules, you'll need to switch to the new builds shown above.

The new entry-points are as follows (all files are under `./build/bundles/`):

- `typedi.full.min.mjs` <sup>(ES Module format.)</sup>
- `typedi.full.mjs`
- `typedi.umd.full.js` <sup>([UMD][umd-module-explainer] modules.)</sup>
- `typedi.umd.full.min.js`

You can now do the following:

```js
import Container, { Contrib } from 'https://unpkg.dev/@freshgum/typedi/build/bundles/typedi.full.mjs';

// Let's use some modules:
const { TransientRef, ES } = Contrib;
assert(TransientRef.TransientRefHost);
```

The same can be done using UMD modules, like so:

```html
<!doctype html>
<html>
  <head>
    <!-- ... -->
  </head>
  <body>
    <!-- Be sure to use subresource integrity in production! ;-) -->
    <script src="https://unpkg.dev/@freshgum/typedi/build/bundles/typedi.umd.full.min.js"></script>
    <script>
      const { Container, Contrib } = TypeDI;
      // ...
    </script>
  </body>
</html>
```

> [!TIP]
> If you've noticed, you can actually import the Container through unpkg!
>
> Here's a link to the latest bundles: https://unpkg.dev/browse/@freshgum/typedi/build/bundles/

---

I've been wanting to implement this for a while, but life has repeatedly found itself in the way.
When spending some time on it, it was mostly a simple job: the majority of the work lied in creating
a new build step to generate a barrel file for contrib/, and then integrating Rollup with that.

If you're interested, the original code for this lies in [#184][gh-issue-184]. It's actually quite interesting!

[umd-module-explainer]: https://jameshfisher.com/2020/10/04/what-are-umd-modules/
[gh-issue-184]: https://github.com/freshgum-bubbles/typedi/pull/184
