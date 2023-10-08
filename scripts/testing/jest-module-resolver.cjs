const path = require('path');
const fs = require('fs');
const assert = require('assert');

/** The base path of the TypeDI source tree. */
const BASE_PATH = path.resolve(__dirname, '../../');

/**
 * The mode in which the resolver should be placed; this mode is set by
 * the `TEST_RESOLVER_MODE` environmental variable.
 *
 * This affects what the magic import specifier (`internal:typedi`) is
 * resolved to at runtime.
 *
 * Possible values:
 * | Value             | Target                                           |
 * | ----------------- | ------------------------------------------------ |
 * | "default"         | Equivalent to "source".                          |
 * | "source"          | Import from `./src/index.mts`.                   |
 * | "bundle:mjs"      | Import from `./build/bundles/typedi.mjs`.        |
 * | "bundle:mjs.min"  | Import from `./build/bundles/typedi.min.mjs`.    |
 * | "bundle:umd"      | Import from `./build/bundles/typedi.umd.js`.     |
 * | "bundle:umd.min"  | Import from `./build/bundles/typedi.umd.min.js`  |
 *
 * Note that tests are performed on all of these.
 *
 * @enum
 */
const ResolverMode = {
  Default: 'default',
  Source: 'source',
  BundleMjs: 'bundle:mjs',
  BundleMjsMin: 'bundle:mjs.min',
  BundleUmd: 'bundle:umd',
  BundleUmdMin: 'bundle:umd.min',
};

/**
 * The magic import specifier which can be used to import the TypeDI module.
 * This is also defined in the respective `tsconfig.spec.json` file.
 */
const MAGIC_TYPEDI_IMPORT_SPECIFIER = 'internal:typedi';

/** The currently-selected resolver mode. */
const RESOLVER_MODE = getResolverMode();

/** The file which will be imported if the `internal:typedi` import specifier is used. */
const IMPORT_SPEC_TARGET = resolveTargetFileFromResolverMode(RESOLVER_MODE);


const resolverModes = Object.keys(ResolverMode);

function getResolverMode() {
  const proposedValue = process.env.TEST_RESOLVER_MODE;

  if (!proposedValue) {
    return ResolverMode.Default;
  }

  // Throw on invalid inputs.
  if (!resolverModes.includes(proposedValue)) {
    throw new Error(`The provided resolver mode "${proposedValue}" is not valid.`);
  }

  return proposedValue;
}

function resolveTargetFileFromResolverMode (mode) {
  switch (mode) {
    case 'source':
    case 'default':
      return path.resolve(BASE_PATH, './src/container-instance.class.mts');
    case 'bundle:mjs':
      return path.resolve(BASE_PATH, './build/bundles/typedi.mjs');
    case 'bundle:mjs.min':
      return path.resolve(BASE_PATH, './build/bundles/typedi.min.mjs');
    case 'bundle:umd':
      return path.resolve(BASE_PATH, './build/bundles/typedi.umd.js');
    case 'bundle:umd.min':
      return path.resolve(BASE_PATH, './build/bundles/typedi.umd.min.js');
    default:
      throw new Error('Unreachable.');
  }
}

/** @param {string} fileName */
function assertFileExists (fileName) {
  assert(fs.existsSync(fileName), `The specified file, "${fileName}", does not currently exist.`);
}

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
    newPath = IMPORT_SPEC_TARGET;
  } else if (modulePath.startsWith(MAGIC_TYPEDI_IMPORT_SPECIFIER)) {
    /** Also support `internal:typedi/src/container-instance.class.mjs` etc. */
    newPath = path.resolve(BASE_PATH, './src/', modulePath.slice(MAGIC_TYPEDI_IMPORT_SPECIFIER.length + 1));
  }

  /** Only change resolution logic for our modules. */
  if (resolvedPath.startsWith(BASE_PATH) && !resolvedPath.includes('node_modules')) {
    /** Transform `.mjs` modules to `.mts`. */
    if (newPath.endsWith('.mjs')) {
      newPath = newPath.replace('.mjs', '.mts');
    }
  }

  /**
   * Make sure the file exists before we pass it back to Jest.
   * If we didn't do this, we'd still get an error -- this makes the error a bit nicer.
   */
  assertFileExists(newPath);

  return options.defaultResolver(newPath, newOptions);
};
