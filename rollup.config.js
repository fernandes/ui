import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'app/javascript/ui/index.js',

  // Mark external dependencies (not bundled)
  external: ['@hotwired/stimulus'],

  output: [
    {
      // UMD format for importmaps and direct browser usage
      file: 'app/assets/javascripts/ui.js',
      format: 'umd',
      name: 'UI',
      exports: 'named',
      globals: {
        '@hotwired/stimulus': 'Stimulus'
      },
      sourcemap: false
    },
    {
      // ESM format for npm packages and bundlers
      file: 'app/assets/javascripts/ui.esm.js',
      format: 'es',
      sourcemap: false
    }
  ],

  plugins: [
    resolve(),
    terser({
      mangle: false,
      compress: false,
      format: {
        beautify: true,
        indent_level: 2
      }
    })
  ],

  // Watch mode configuration for development
  watch: {
    include: 'app/javascript/**/*.js',
    clearScreen: false
  }
};
