const { repository, name } = require('./package.json');

const repositoryURL = repository.url.replace(/\/?\.git$/i, '');

/** @type {import('typedoc').TypeDocOptions} */
var configuration = {
  /**
   * The barrel file exports everything consumers should currently know about.
   * Perhaps in future we may want to also document contrib/ packages.
   */
  entryPoints: ['./src/index.mts'],
  gitRemote: repositoryURL,
  disableGit: false,

  /** Not sure how you would even localize TSDoc... */
  htmlLang: 'en',

  includeVersion: true,

  navigationLinks: {
    /** Link to https://typedi.js.org/ */
    home: '/',
  },

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  sourceLinkTemplate: `${repositoryURL}/blob/{gitRevision}/{path}#L{line}`,

  /** Use the mxssfd theme. */
  plugin: ['@mxssfd/typedoc-theme'],
  theme: 'my-theme',

  name,

  /** The README is included in the index.html page. */
  readme: 'README.md',
  tsconfig: 'tsconfig.typedoc.json',
  out: './docs/static/api-reference/',
  pretty: true,
  titleLink: repository.url,
};

module.exports = configuration;
