import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/LivePhotoViewer.js',
      format: 'umd',
      name: 'LivePhotoViewer',
      sourcemap: true,
      exports: 'named',
      globals: {
        tslib: 'tslib',
      },
    },
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
  external: ['tslib'],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationMap: true,
    }),
    postcss({
      minimize: true,
      inject: false,
      extract: false,
    }),
  ],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
  },
};

