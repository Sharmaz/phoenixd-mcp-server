import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";


export default defineConfig([
  {
    files: ["src/**/*.{js,mjs,cjs,ts}"],
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      "indent": ["error", 2],
      "quotes": ["error", "single", { avoidEscape: true }],
      "semi": ["error", "always"],
      "comma-dangle": ["error", "always-multiline"],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "no-console": "off",
      "no-unused-vars": "error",
      "prefer-const": "error",
      "eqeqeq": ["error", "always"],
      "arrow-body-style": ["error", "as-needed"],
      "no-var": "error",
      "no-multiple-empty-lines": ["error", { max: 1 }],
      "max-len": ["error", { code: 150 }],
      "indent": ["error", 2],
      "no-trailing-spaces": "error",
      "no-multiple-empty-lines": ["error", { max: 1, maxBOF: 0, maxEOF: 0 }],
    },
  },
  { files: ["src/**/*.{js,mjs,cjs,ts}"], languageOptions: { globals: globals.node } },
  tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": 0,
    }
  }
]);
