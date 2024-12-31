import pluginJs from "@eslint/js";
import globals from "globals";
/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ["test/**/*.js"] },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        process: "readonly", // Define `process` como uma variável global de leitura
      },
    },
    files: ["src/**/*.js"],

    rules: {
      indent: ["error", 2],
      "no-unused-vars": "warn",
    },
  },
  pluginJs.configs.recommended,
];
