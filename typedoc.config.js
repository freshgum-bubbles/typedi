/** @type {import('typedoc').TypeDocOptions} */
var configuration = {
    "entryPoints": [
        "./src/index.ts"
    ],
    "plugin": [
        /** Generate plain Markdown to be consumed by Docusaurus. */
        "typedoc-plugin-markdown"
    ],
    "readme": "README.md",
    "tsconfig": "tsconfig.typedoc.json",
    "out": "./website/docs/api-reference/"
}

module.exports = configuration;