/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * @fileoverview
 * This file manages imports for test files, via Jest's custom resolver API.
 * It adds support for the `internal:typedi` module specifier, which is used to
 * import a version of TypeDI++ without `../../../../../...`.
 * 
 * Currently, the imported TypeDI++ version is `../../src/container-instance.class.mts`.
 */

const path = require('path');
const basePath = path.resolve(__dirname, '../../');

const MAGIC_TYPEDI_IMPORT_SPECIFIER = 'internal:typedi';

/** @type {(path: string, options: import('./resolver-options').ResolverOptions) => string} */
module.exports = (modulePath, options) => {
  let newPath = modulePath;
  let newOptions = options;

  /**
   * Resolve the path relative to the base directory.
   * In this case, the base directory in the options is the folder in which
   * the module we are currently resolving is located.
   */
  const resolvedPath = path.resolve(options.basedir, modulePath);

  /** Special case: transform the internal module specifier. */
  if (modulePath === MAGIC_TYPEDI_IMPORT_SPECIFIER) {
    newPath = path.resolve(basePath, './src/index.mts');
  } else if (modulePath.startsWith(MAGIC_TYPEDI_IMPORT_SPECIFIER)) {
    /** Also support `internal:typedi/src/container-instance.class.mjs` etc. */
    newPath = path.resolve(basePath, './src/', modulePath.slice(MAGIC_TYPEDI_IMPORT_SPECIFIER.length + 1));
  }

  /** Only change resolution logic for our modules. */
  if (resolvedPath.startsWith(basePath) && !resolvedPath.includes('node_modules')) {
    /** Transform `.mjs` modules to `.mts`. */
    if (newPath.endsWith('.mjs')) {
      newPath = newPath.replace('.mjs', '.mts');
    }
  }

  return options.defaultResolver(newPath, newOptions);
};
