import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
    globalIgnores(["**/dist/"]),

    js.configs.recommended,

    {
        files: ["packages/*/src/**/*.{ts,tsx}", "packages/*/*.config.ts"],
        extends: [tseslint.configs.recommended],
    },

    // node: build scripts, config files and the non-react packages
    {
        files: [
            "scripts/**",
            "packages/*/scripts/**",
            "packages/*/*.config.{js,ts}",
            "packages/mdxjs-common/src/**",
            "packages/mdxjs-code-plugin/src/**",
        ],
        languageOptions: {
            globals: globals.node,
        },
    },

    {
        files: ["packages/mdxjs-react/src/**/*.{ts,tsx}"],
        extends: [react.configs.flat.recommended],
        plugins: { "react-hooks": reactHooks },
        languageOptions: {
            globals: globals.browser,
        },
        settings: {
            react: { version: "detect" },
        },
        rules: {
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
            // props are checked by TypeScript.
            "react/prop-types": "off",
        },
    },

    {
        files: ["packages/example/src/**/*.{ts,tsx}"],
        extends: [
            react.configs.flat.recommended,
            react.configs.flat["jsx-runtime"],
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            globals: globals.browser,
        },
        settings: {
            react: { version: "18.2" },
        },
        rules: {
            "react/prop-types": "off",
        },
    },
]);
