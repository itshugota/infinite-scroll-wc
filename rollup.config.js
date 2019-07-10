import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: './src/infinite-scroll.js',
  output: {
    dir: 'dist',
    name: 'infinite-scroll.js',
    format: 'esm'
  },
  plugins: [
    resolve(),
    commonjs()
  ]
};
