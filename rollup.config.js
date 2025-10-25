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
  plugins: [
    typescript({ tsconfig: './tsconfig.json' }),
    postcss(),
  ],
};

