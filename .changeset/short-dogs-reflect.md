---
'@freshgum/typedi': minor
---

Currently, ESService does not return its target. The usage of the `Constructable` type also causes issues, as it makes
the decorator return the wrong type.

This causes the following error:

> "Decorator function return type 'void | Constructable<AuthStoreService>' is not assignable to type 'void | typeof AuthStoreService'".

This occured when I added the decorator to a class which extended another.

I've updated the decorator to return the target, as opposed to a wrapped version, and this seems to have fixed the issue.
