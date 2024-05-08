---
'@freshgum/typedi': patch
---

[SynchronousDisposable is actually usable now.](https://github.com/freshgum-bubbles/typedi/pull/167/commits/5228df1f98e6c13b90aa5c34094b9c312b6992c1)
Prior to this, it was listed in `package.json` but wasn't importable.

I'm really sorry about this: [Packaging certainly isn't my strongest point](https://github.com/freshgum-bubbles/typedi/issues/96), and to date, I've caught quite a few painful `package.json`-related errors in production.

The upside to all this is that I'm working on making it better -- in fact, this issue was only caught
when [adding publint checks for the package](https://github.com/freshgum-bubbles/typedi/pull/167).  publint is an excellent tool that makes sure your package works well across different environments (and like... actually works).

A few other things have been fixed too, namely:
  - [Loading the package from unpkg now works](https://unpkg.dev/@freshgum/typedi) <sup>[(commit)](https://github.com/freshgum-bubbles/typedi/pull/167/commits/d9ffcdda32c4414f71f3bc434fefc833e872d01d)</sup>
  - An error where the `default` export condition may have taken precedence over others <sup>[(commit)](https://github.com/freshgum-bubbles/typedi/pull/167/commits/8d9b447504be19ea1e4169c45ef025263f6e7a2e)</sup>

I hope this changelog entry inspires you to start linting your `package.json`, because dealing with this stuff really sucks.