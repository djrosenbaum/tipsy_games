const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { babel } = require('@rollup/plugin-babel');
const commonjs = require('@rollup/plugin-commonjs');
const path = require('path');

const base = path.join('projects', process.env.CLIENT);

module.exports = {
  input: path.resolve(base, 'src', 'js', 'main.js'),
  output: {
    file: path.resolve(base, 'dist', 'js', 'bundle.js'),
    format: 'iife'
  },
  plugins: [
		nodeResolve({
      browser: true,
    }),
    commonjs(),
		babel({
      babelHelpers: 'bundled',
			exclude: 'node_modules/**' // only transpile our source code
		})
  ]
};