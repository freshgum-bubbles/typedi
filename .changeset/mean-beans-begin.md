---
'@freshgum/typedi': patch
---

The container now removes visitors which throw an error in their `visitContainer` method.
Previously, this resulted in them still receiving notifications from the attached container.
