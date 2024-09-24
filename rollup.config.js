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
        name: "UI"
      },

      {
        file: "app/assets/javascripts/ui.esm.js",
        format: "es"
      }
    ],
    plugins: [
      resolve(),
      terser(terserOptions)
    ]
  },

  {
    input: "app/javascript/ui/index_with_name_deprecation.js",
    output: {
      file: "app/assets/javascripts/ui.js",
      format: "umd",
      name: "UI"
    },
    plugins: [
      resolve(),
      terser(terserOptions)
    ]
  },
]
