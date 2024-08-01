---
'@freshgum/typedi': patch
---

Two new type-wrapper helper interfaces have been added:
  - `EagerTypeWrapper`: Match type-wrappers with a non-nullish `eagerType`,
    and a `undefined` or non-present `extract` member.
  - `ExtractableTypeWrapper`: Match type-wrappers with a non-nullish `extract`,
    and a `undefined` or non-present `eagerType` member.