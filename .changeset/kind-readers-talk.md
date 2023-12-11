---
'@freshgum/typedi': patch
---

stripInternal has been disabled in the package's TSConfig due to it breaking fresh installs of the package. This shouldn't affect you unless you rely upon the container's internal `visitor` property, which has its properties mangled to reduce bundle size.
