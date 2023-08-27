import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import licensePlugin from 'rollup-plugin-license';
import mergeObjects from 'deepmerge';
import { fileURLToPath } from 'url';
import assert from 'assert';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BUILD_PREAMBLE_PATH = './scripts/build/bundle-preamble.js';
const BUILD_PREAMBLE = fs.readFileSync(BUILD_PREAMBLE_PATH, 'utf8').toString();
assert(BUILD_PREAMBLE, `The bundle preamble was not found in ${BUILD_PREAMBLE_PATH}`);

const LICENSE_PATH = './LICENSE';
const LICENSE_TEXT = fs.readFileSync(LICENSE_PATH, 'utf8').toString();
assert(LICENSE_TEXT, 'The license file (named LICENSE) could not be found in the root directory.');

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

/** 
 * @type {Partial<import('rollup').OutputOptions>} 
 * A partial set of options for all Rollup output declarations.
 */
const DEFAULT_ROLLUP_OUTPUT_OPTIONS = {
  sourcemap: true
};

/**
 * @param {import('rollup').OutputOptions} options The options to merge with defaults.
 */
function createOutput (options) {
  return mergeObjects(DEFAULT_ROLLUP_OUTPUT_OPTIONS, options);
}

/** 
 * @type {import('@rollup/plugin-terser').Options} 
 * A set of Terser options for ES6 builds of TypeDI.
 */
const MJS_TERSER_OPTIONS = mergeObjects(TERSER_OPTIONS, {
  compress: {
    module: true
  }  
});

/** @param {import('rollup').OutputOptions} output */
function transformRollupOutputItem (output) {
  if (!output.plugins) {
    output.plugins = [ ];
  }

  if (!output.file?.includes('.min')) {
    output.plugins.push(licensePlugin({
      banner: {
        commentStyle: 'none',
        content: BUILD_PREAMBLE,
        data: {
          licenseText: LICENSE_TEXT
        }
      }
    }));
  }

  return output;
}

export default {
  input: 'build/esm5/index.js',
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
  ].map(createOutput).map(transformRollupOutputItem),
  plugins: [commonjs(), nodeResolve()],
};
