import prettier from "eslint-plugin-prettier";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["**/dist"],
}, ...compat.extends(
    "prettier",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "../.eslintrc.js",
), {
    plugins: {
        prettier,
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        ecmaVersion: 2022,
        sourceType: "module",

        parserOptions: {
            parser: "@typescript-eslint/parser",
            project: "./tsconfig.json",
        },
    },
}];