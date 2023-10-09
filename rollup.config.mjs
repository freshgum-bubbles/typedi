import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import mergeObjects from 'deepmerge';
import isStringYes from 'yn';

const UMD_BUNDLE_PATH = 'build/bundles/typedi.umd.js';
const UMD_MIN_BUNDLE_PATH = 'build/bundles/typedi.umd.min.js';
const MJS_BUNDLE_PATH = 'build/bundles/typedi.mjs';
const MJS_MIN_BUNDLE_PATH = 'build/bundles/typedi.min.mjs';

/**
 * A list of properties in the codebase to mangle.
 * In this case, "mangling" refers to the minification of the names in the final bundle.
 * Note that this only affects minified builds (ending in `.min.js`).
 *
 * The addition of members to this array should be done very cautiously.
 *
 * __WARNING: DO NOT ADD ANY MEMBERS OF PUBLICLY-EXPORTED CLASSES / OBJECTS HERE.__
 *
 * A special exception is made for `ContainerInstance.throwIfDisposed`, which is
 * marked as private and can easily be replicated.
 */
const SAFE_PROPERTIES_TO_MANGLE = [
  // ContainerInstance
  'throwIfDisposed',

  //VisitorCollection
  'notifyChildContainerVisited',
  'notifyChildContainerVisited',
  'notifyOrphanedContainerVisited',
  'notifyNewServiceVisited',
  'notifyRetrievalVisited',
  'notifyVisitors',
  'forwardOrphanedContainerEvents',
  'anyVisitorsPresent',
  'forEachVisitor',
  'addVisitorToCollection',
  'removeVisitorFromCollection',
];

/**
 * A list of properties in the codebase to mangle.
 *
 * Unlike `SAFE_PROPERTIES_TO_MANGLE`, this list contains publicly-exposed members.
 * This list may be useful in the case of `umd.js` builds, where consumers
 * require the absolute bare minimum file size, at the expense of being able to
 * (safely & deterministically) access well-known public / private class members.
 *
 * **This is not currently used.**
 */
const UNSAFE_PROPERTIES_TO_MANGLE = [
  // ContainerInstance
  'getServiceValue',
  'disposeServiceInstance',
  'getOrDefault',
  'getManyOrDefault',
  'resolveMetadata',
  'getIdentifierLocation',
  'resolveConstrainedIdentifier',
  'resolveMultiID',
  'multiServiceIds',
  'metadataMap',
  'resolveTypeWrapper',
  'isRetrievingPrivateToken',
  'getConstructorParameters',
  'resolveResolvable',
  'visitor',

  // ManyServicesMetadata
  'tokens',

  // TypeWrapper
  'extract',
  'lazyType',
  'eagerType',

  // ContainerRegistry
  'registerContainer',
  'hasContainer',
  'getContainer',
  'removeContainer',
  'containerMap',

  // Errors
  'normalizedIdentifier',
  'footer',
];

const PROPERTIES_TO_MANGLE = getListOfPropertiesToMangle();

/** @type {import('@rollup/plugin-terser').Options} */
const TERSER_OPTIONS = {
  parse: {
    html5_comments: false,
    shebang: false,
  },
  compress: {
    defaults: true,
    keep_fargs: false,
    passes: 5,
    unsafe_symbols: true,
  },
  format: {
    ecma: 6,
    ie8: false,
    comments: false,
    wrap_func_args: false,
  },
  mangle: {
    safari10: false,
    properties: {
      regex: new RegExp(PROPERTIES_TO_MANGLE.join('|')),
    },
  },
};

/**
 * @type {Partial<import('rollup').OutputOptions>}
 * A partial set of options for all Rollup output declarations.
 */
const DEFAULT_ROLLUP_OUTPUT_OPTIONS = {
  sourcemap: true,
};

/**
 * @type {import('@rollup/plugin-terser').Options}
 * A set of Terser options for ES6 builds of TypeDI.
 */
const MJS_TERSER_OPTIONS = mergeObjects(TERSER_OPTIONS, {
  compress: {
    module: true,
  },
});

/**
 * Get a list of properties to mangle in minified builds.
 *
 * @see {@link SAFE_PROPERTIES_TO_MANGLE}
 * @see {@link UNSAFE_PROPERTIES_TO_MANGLE}
 */
function getListOfPropertiesToMangle() {
  const PROPERTIES_TO_MANGLE = [];

  /** Safe properties are always mangled. */
  PROPERTIES_TO_MANGLE.push(...SAFE_PROPERTIES_TO_MANGLE);

  const MANGLE_UNSAFE = isStringYes(process.env.MANGLE_UNSAFE, {
    default: false,
  });

  if (MANGLE_UNSAFE) {
    PROPERTIES_TO_MANGLE.push(...UNSAFE_PROPERTIES_TO_MANGLE);
  }
  return PROPERTIES_TO_MANGLE;
}

/**
 * Interpolate a pre-existing Rollup output options object with further values.
 *
 * @param {import('rollup').OutputOptions} options The options to merge with defaults.
 */
function createOutput(options) {
  return mergeObjects(DEFAULT_ROLLUP_OUTPUT_OPTIONS, options);
}

export default {
  input: 'build/esm5/index.mjs',
  output: [
    {
      name: 'TypeDI',
      format: 'umd',
      file: UMD_BUNDLE_PATH,
    },
    {
      name: 'TypeDI',
      format: 'umd',
      file: UMD_MIN_BUNDLE_PATH,
      plugins: [terser(TERSER_OPTIONS)],
    },
    {
      format: 'es',
      file: MJS_BUNDLE_PATH,
    },
    {
      format: 'es',
      file: MJS_MIN_BUNDLE_PATH,
      plugins: [terser(MJS_TERSER_OPTIONS)],
    },
  ].map(createOutput),
  plugins: [commonjs(), nodeResolve()],
};
