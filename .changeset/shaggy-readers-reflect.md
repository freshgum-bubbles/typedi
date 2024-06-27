---
'@freshgum/typedi': patch
---

Dedicated entry-points have been added for web-facing builds. You're now able to use modules from contrib/ without relying on a bundler.

From now on, the bundler now emits the following files under `./build/bundles/`:
  - `typedi.full.min.mjs`
  - `typedi.full.mjs`
  - `typedi.min.mjs`
  - `typedi.mjs`
  - `typedi.tiny.min.mjs`
  - `typedi.umd.full.js`
  - `typedi.umd.full.min.js`
  - `typedi.umd.js`
  - `typedi.umd.min.js`

I've been wanting to implement this for a while.  If you're intersted, #184 tracks the overall progress of this feature.
The hardest part was creating an additional build step to create a barrel file for contrib/ modules.  This then had to
be integrated into Rollup, which was another chore -- overall, I'm pretty happy that it works :-)