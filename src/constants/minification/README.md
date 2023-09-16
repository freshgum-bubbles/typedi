# `constants/minification`

This folder contains bindings to native identifiers, the purpose
of which is to reduce the final output size of the bundle.

As an example, consider the usage of `NativeError` throughout the
codebase.  A binding is made at the top of the bundle (to `Error`),
and the binding is then used throughout the codebase.

This also provides the environment with greater security, as any
overrides performed by the user will have a lesser chance of affecting
TypeDI.
