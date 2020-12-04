import commonjs from '@rollup/plugin-commonjs';
import path from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';

const base = path.join('projects', process.env.CLIENT);

export default {
  input: path.resolve(base, 'src', 'js', 'main.js'),
  output: {
    file: path.resolve(base, 'temp', 'js', 'bundle.js'),
    format: 'iife',
  },
  plugins: [
    nodeResolve({
      browser: true,
    }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**', // only transpile our source code
    }),
  ],
};
