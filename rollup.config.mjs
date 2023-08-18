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
  'removeVisitorFromCollection'
];

/** @type {import('@rollup/plugin-terser').Options} */
const TERSER_OPTIONS = {
  compress: {
    defaults: true,
    keep_fargs: false,
    passes: 3,
    unsafe_symbols: true
  },
  format: {
    ecma: 6,
    ie8: false,
    comments: false
  },
  mangle: {
    properties: {
      regex: new RegExp(PROPERTIES_TO_MANGLE.join('|'))
    }
  }
};

/** @type {import('@rollup/plugin-terser').Options} */
const MJS_TERSER_OPTIONS = mergeObjects(TERSER_OPTIONS, {
  compress: {
    module: true
  }  
});

export default {
  input: 'build/esm5/index.js',
  output: [
    {
      name: 'TypeDI',
      format: 'umd',
      file: 'build/bundles/typedi.umd.js',
      sourcemap: true,
    },
    {
      name: 'TypeDI',
      format: 'umd',
      file: 'build/bundles/typedi.umd.min.js',
      sourcemap: true,
      plugins: [terser(TERSER_OPTIONS)],
    },
    {
      format: 'es',
      file: 'build/bundles/typedi.mjs',
      sourcemap: true,
    },
    {
      format: 'es',
      file: 'build/bundles/typedi.min.mjs',
      sourcemap: true,
      plugins: [terser(MJS_TERSER_OPTIONS)],
    }
  ],
  plugins: [commonjs(), nodeResolve()],
};
