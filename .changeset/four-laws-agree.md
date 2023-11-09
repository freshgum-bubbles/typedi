---
'@freshgum/typedi': patch
---

Add a new `getServiceIdentifierType` utility to ascertain the type of a given `ServiceIdentifier`. This allows for differentiation between virtual identifiers, such as `HostContainer`, and concrete identifiers set by you / any code which interacts with the `ContainerInstance`.
