// @ts-check

import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import mergeObjects from 'deepmerge';
import isStringYes from 'yn';

const UMD_NAME = 'TypeDI';
const UMD_BUNDLE_PATH = 'build/bundles/typedi.umd.js';
const UMD_MIN_BUNDLE_PATH = 'build/bundles/typedi.umd.min.js';
const MJS_BUNDLE_PATH = 'build/bundles/typedi.mjs';
const MJS_MIN_BUNDLE_PATH = 'build/bundles/typedi.min.mjs';

// See below for information on tiny builds.
const MJS_TINY_BUNDLE_PATH = 'build/bundles/typedi.tiny.min.mjs';

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

const PROPERTIES_TO_MANGLE_FOR_TINY_BUILDS = [...SAFE_PROPERTIES_TO_MANGLE, ...UNSAFE_PROPERTIES_TO_MANGLE];

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

    // Unsafe transformations.
    // Be careful when changing these!
    unsafe: true,

    // Remove names from Symbol() expressions.
    unsafe_symbols: true,

    // Transform regular functions to arrow functions in select circumstances.
    unsafe_arrows: true,

    // Transform { m: function () { } } to { m() { } }.
    // We don't strictly need this, as we never use functions as properties,
    // but it may be useful in future.
    unsafe_methods: true,

    // Disable unsafe comparisons, as it may cause issues.
    unsafe_comps: false,
    hoist_funs: true,
    pure_getters: true,
  },
  format: {
    ecma: 2020,

    // We won't need IE8 where we're going.
    ie8: false,
    comments: false,
    wrap_func_args: false,
  },
  mangle: {
    // Disable any support for Safari 10.
    // It's a deprecated version, and we only target evergreen browsers.
    safari10: false,
    properties: {
      // For ordinary .min.js builds, we ALWAYS use the safe list of properties to mangle.
      // The unsafe lists may cause a few issues with those who need to access private
      // Container API's.
      regex: new RegExp(SAFE_PROPERTIES_TO_MANGLE.join('|')),
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
 * @type {import('@rollup/plugin-terser').Options}
 * A set of Terser options for tiny builds of TypeDI.
 */
const TINY_TERSER_OPTIONS = mergeObjects(TERSER_OPTIONS, {
  mangle: {
    properties: {
      regex: new RegExp(PROPERTIES_TO_MANGLE_FOR_TINY_BUILDS.join('|')),
    },
  },
});

/**
 * @type {import('@rollup/plugin-terser').Options}
 * A set of Terser options for tiny.mjs builds of TypeDI.
 */
const MJS_TINY_TERSER_OPTIONS = mergeObjects(TINY_TERSER_OPTIONS, {
  compress: {
    module: true,
  },
});

/**
 * Interpolate a pre-existing Rollup output options object with further values.
 *
 * @param {import('rollup').OutputOptions} options The options to merge with defaults.
 * @return {import('rollup').OutputOptions}
 */
function createOutput(options) {
  return mergeObjects(DEFAULT_ROLLUP_OUTPUT_OPTIONS, options);
}

export default {
  input: 'build/esm5/index.mjs',
  output: [
    {
      name: UMD_NAME,
      format: 'umd',
      file: UMD_BUNDLE_PATH,
    },
    {
      name: UMD_NAME,
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

    // Tiny builds of TypeDI are experimental; they're mostly designed for private use,
    // to investigate ways to optimize the Container architecture.
    // They include minification for more private symbols, which may cause issues for
    // those who require access to private Container API's.
    //
    // They're also only available in ES Modules format (so no UMD variants).
    // Therefore, they're not yet recommended for public consumption.
    {
      format: 'es',
      file: MJS_TINY_BUNDLE_PATH,
      plugins: [terser(MJS_TINY_TERSER_OPTIONS)],
    },
  ].map(createOutput),
  plugins: [commonjs(), nodeResolve()],
};
