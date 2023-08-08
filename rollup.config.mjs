import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import mergeObjects from 'deepmerge';

/** @type {import('@rollup/plugin-terser').Options} */
const terserOptions = {
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
  }
};

/** @type {import('@rollup/plugin-terser').Options} */
const mjsTerserOptions = mergeObjects(terserOptions, {
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
      plugins: [terser(terserOptions)],
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
      plugins: [terser(mjsTerserOptions)],
    }
  ],
  plugins: [commonjs(), nodeResolve()],
};