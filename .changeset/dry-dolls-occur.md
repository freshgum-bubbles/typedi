---
'@freshgum/typedi': patch
---

The `ContainerRegistry.removeContainer` method no longer disposes already-disposed containers. This may have been an issue if a container was disposed, and then `removeContainer` was called; the call would always fail, as the registry attempted a disposal upon the container when doing so was invalid.
