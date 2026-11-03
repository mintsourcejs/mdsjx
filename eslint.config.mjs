import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";

export default defineConfig([
    globalIgnores(["**/dist/"]),

    js.configs.recommended,

    // node: build scripts, config files and the non-react packages
    {
        files: [
            "scripts/**",
            "packages/*/scripts/**",
            "packages/*/*.config.js",
            "packages/mdxjs-common/src/**",
            "packages/mdxjs-code-plugin/src/**",
        ],
        languageOptions: {
            globals: globals.node,
        },
    },

    {
        files: ["packages/mdxjs-react/src/**/*.js"],
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
        },
    },

    {
        files: ["packages/example/src/**/*.{js,jsx}"],
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
