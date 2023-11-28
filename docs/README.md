# The Website(tm)

This folder contains the website for the TypeDI project.
It is built using Docusaurus 2, with some modifications made to the base theme.

The Markdown files can be found within [the docs folder](./docs/).
Our site configuration can be found in [the Docusaurus configuration file](./docusaurus.config.js).

Finally, this repository also makes use of PNPM to manage dependencies.

## Installation

To start this site, you'll need to install the dependencies, like so:

```sh
$ pnpm install
```

...then, you can launch it like so:

```sh
$ pnpm start
```

Note that this will start a local HTTP server with the website built in development mode.
If you instead want a static variant of the site, jump to the [#building](Building) section.

## Building

To build a static variant of the site, you'll need to run the following command:

```sh
$ pnpm build
```

This will emit the build output to [the build directory](./build/).

## License

This project inherits its license from [the overall TypeDI<sup>++</sup> project](../LICENSE).
