import path from 'path';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';

const base = path.join('projects', process.env.CLIENT);

export default {
  input: path.resolve(base, 'src', 'js', 'main.js'),
  output: {
    file: path.resolve(base, 'temp', 'js', 'bundle.js'),
    format: 'iife',
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
    }),
  ],
};
