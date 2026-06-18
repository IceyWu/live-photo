import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';

const plugins = [
  typescript({ tsconfig: './tsconfig.json' }),
  postcss({ inject: true, extract: false }),
];

export default [
  // 库入口：ESM + CJS，保持无顶层副作用，框架/打包器友好（可 tree-shake）。
  {
    input: 'src/index.ts',
    treeshake: {
      preset: 'recommended',
    },
    output: [
      {
        file: 'dist/LivePhotoViewer.esm.js',
        format: 'es',
        sourcemap: true,
      },
      {
        file: 'dist/LivePhotoViewer.cjs.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
    ],
    plugins,
  },
  // CDN/UMD 入口：DOM 就绪后自动扫描 [data-live-photo] 并渲染。
  {
    input: 'src/auto.ts',
    output: [
      {
        file: 'dist/LivePhotoViewer.js',
        format: 'umd',
        name: 'LivePhotoViewer',
        sourcemap: true,
        exports: 'named',
      },
    ],
    plugins,
  },
];
