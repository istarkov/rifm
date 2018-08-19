import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import pkg from './package.json';

const input = './src/index.js';

const external = id => !id.startsWith('.') && !id.startsWith('/');

const globals = { react: 'React' };

const name = 'Rifm';

const getBabelOptions = ({ useESModules }) => ({
  exclude: '**/node_modules/**',
  runtimeHelpers: true,
  plugins: [['@babel/plugin-transform-runtime', { useESModules }]],
});

export default [
  {
    input,
    output: { file: 'dist/rifm.umd.js', format: 'umd', name, globals },
    external: Object.keys(globals),
    plugins: [
      nodeResolve(),
      babel(getBabelOptions({ useESModules: true })),
      sizeSnapshot(),
    ],
  },

  {
    input,
    output: { file: pkg.main, format: 'cjs' },
    external,
    plugins: [babel(getBabelOptions({ useESModules: false })), sizeSnapshot()],
  },

  {
    input,
    output: { file: pkg.module, format: 'esm' },
    external,
    plugins: [babel(getBabelOptions({ useESModules: true })), sizeSnapshot()],
  },
];
