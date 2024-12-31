import resolve from "@rollup/plugin-node-resolve"
import { terser } from "rollup-plugin-terser"

const terserOptions = {
  mangle: false,
  compress: false,
  format: {
    beautify: true,
    indent_level: 2
  }
}

export default [
  {
    input: "app/javascript/ui/index.js",
    output: [
      {
        file: "app/assets/javascripts/ui.js",
        format: "umd",
        name: "UI",
        globals: {
          'https://cdn.jsdelivr.net/npm/motion@11.11.13/+esm': 'motion'
        }
      },

      {
        file: "app/assets/javascripts/ui.esm.js",
        format: "es",
        globals: {
          'https://cdn.jsdelivr.net/npm/motion@11.11.13/+esm': 'motion'
        }
      }
    ],
    external: ['https://cdn.jsdelivr.net/npm/motion@11.11.13/+esm'],
    watch: {
      include: 'app/javascript/**/*.js'
    },
    plugins: [
      resolve(),
      terser(terserOptions)
    ]
  }
]
