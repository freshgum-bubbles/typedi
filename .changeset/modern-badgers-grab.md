---
'@freshgum/typedi': minor
---

Type wrappers have been refactored! All internal type-wrappers (Lazy, TransientRef, etc.) have been refactored into new "extractable type-wrappers"; this simplifies the implementation. Unless you're writing custom type-wrappers, this won't affect you!
