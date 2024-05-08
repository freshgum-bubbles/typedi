---
'@freshgum/typedi': patch
---

The code for virtual tokens (such as `HostContainer()`) has been moved into individual tokens,
as opposed to hosting logic for these tokens in `ContainerInstance`.

This means that we no longer have to check for individual tokens in the container's
`.get` code-path, [which has historically been the case.](https://github.com/freshgum-bubbles/typedi/blob/cd4b8437ac14882a0ed4d1964d76e29b32bd1b3e/src/container-instance.class.mts#L331)

Instead, logic for these tokens is now moved into special tokens called Executable Tokens.

This yields numerous advantages, one of which being that, should a certain special token go
unused, its code can safely be removed from a bundle via dead-code elimination.

While **this is mostly an internal change**, the concept of Executable Tokens works quite well,
and so I'm considering making it part of the public API surface + documentation after further testing.
