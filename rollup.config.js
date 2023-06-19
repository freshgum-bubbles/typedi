import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

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
      plugins: [terser()],
    },
  ],
  plugins: [commonjs(), nodeResolve()],
};