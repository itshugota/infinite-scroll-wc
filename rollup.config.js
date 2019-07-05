import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: './src/infinite-scroll.js',
  output: {
    dir: 'dist',
    name: 'infinite-scroll.js',
    format: 'esm'
  },
  plugins: [
    resolve(),
    commonjs(),
    production && terser()
  ]
};
