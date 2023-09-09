---
'@freshgum/typedi': minor
---

Singletons are no longer imported into containers which use them.

This is a relatively minor change, and one which improves the consistency of the core API.  Now, when a container uses a singleton, it calls the Container's `get` method, instead of importing the metadata relating to the singleton into the container.

This means that if the value of a singleton changes, it will be updated from retrospective calls to other containers' `get` methods.