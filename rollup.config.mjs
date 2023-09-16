import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import mergeObjects from 'deepmerge';

/**
 * A list of properties in the codebase to mangle.
 * In this case, "mangling" refers to the minification of the names in the final bundle.
 *
 * The addition of members to this array should be done very cautiously.
 *
 * WARNING: DO NOT ADD ANY MEMBERS OF PUBLICLY-EXPORTED CLASSES / OBJECTS HERE!!!
 * A special exception is made for `ContainerInstance.throwIfDisposed`, which is
 * marked as private and can easily be replicated.
 */
const PROPERTIES_TO_MANGLE = [
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

/** @type {import('@rollup/plugin-terser').Options} */
const TERSER_OPTIONS = {
  parse: {
    html5_comments: false,
    shebang: false
  },
  compress: {
    defaults: true,
    keep_fargs: false,
    passes: 3,
    unsafe_symbols: true,
  },
  format: {
    ecma: 6,
    ie8: false,
    comments: false,
    wrap_func_args: false
  },
  mangle: {
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
 * @param {import('rollup').OutputOptions} options The options to merge with defaults.
 */
function createOutput(options) {
  return mergeObjects(DEFAULT_ROLLUP_OUTPUT_OPTIONS, options);
}

/**
 * @type {import('@rollup/plugin-terser').Options}
 * A set of Terser options for ES6 builds of TypeDI.
 */
const MJS_TERSER_OPTIONS = mergeObjects(TERSER_OPTIONS, {
  compress: {
    module: true,
  },
});

export default {
  input: 'build/esm5/index.mjs',
  output: [
    {
      name: 'TypeDI',
      format: 'umd',
      file: 'build/bundles/typedi.umd.js',
    },
    {
      name: 'TypeDI',
      format: 'umd',
      file: 'build/bundles/typedi.umd.min.js',
      plugins: [terser(TERSER_OPTIONS)],
    },
    {
      format: 'es',
      file: 'build/bundles/typedi.mjs',
    },
    {
      format: 'es',
      file: 'build/bundles/typedi.min.mjs',
      plugins: [terser(MJS_TERSER_OPTIONS)],
    },
  ].map(createOutput),
  plugins: [commonjs(), nodeResolve()],
};
