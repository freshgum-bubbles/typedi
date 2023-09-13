const { repository, name } = require('./package.json');

/** @type {import('typedoc').TypeDocOptions} */
var configuration = {
  entryPoints: ['./src/index.ts'],
  gitRemote: repository,
  plugin: ['@mxssfd/typedoc-theme'],
  theme: 'my-theme',
  readme: 'README.md',
  tsconfig: 'tsconfig.typedoc.json',
  out: './website/static/api-reference/',
  pretty: true,
  titleLink: repository.url,
};

module.exports = configuration;
