import { describe, expect, it } from "vitest";
import { renderImport } from "./renderImport.js";

describe("renderImport should", () => {
    it("render namedImports", () => {
        expect(renderImport({ module: "@mintsourcejs/mdxjs-react", namedImports: ["MdxScopeProvider"] }))
            .toEqual('import {MdxScopeProvider} from "@mintsourcejs/mdxjs-react";');
    });

    it("render side effect imports", () => {
        expect(renderImport({ module: "m/style.css" })).toEqual('import "m/style.css";');
    });

    it("render default and named imports", () => {
        expect(renderImport({ module: "m", defaultImport: "D", namedImports: [{ name: "a", alias: "b" }] }))
            .toEqual('import D, {a as b} from "m";');
    });

    it("render namespace imports", () => {
        expect(renderImport({ module: "m", namespaceImport: "N" })).toEqual('import * as N from "m";');
        expect(renderImport({ module: "m", defaultImport: "D", namespaceImport: "N" })).toEqual('import D, * as N from "m";');
    });

    it("render namespace and named imports as separate statements", () => {
        expect(renderImport({ module: "m", defaultImport: "D", namespaceImport: "N", namedImports: ["a"] }))
            .toEqual('import D, * as N from "m";\nimport {a} from "m";');
    });

    it("quote names that aren't identifiers", () => {
        expect(renderImport({ module: "m", namedImports: [{ name: "a-b", alias: "ab" }] }))
            .toEqual('import {"a-b" as ab} from "m";');
    });
});
