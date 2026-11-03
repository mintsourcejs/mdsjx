import { describe, expect, it } from "vitest";
import { renderImport } from "./renderImport.js";

describe("renderImport should", () => {
    it("render namedImports", () => {
        expect(renderImport({ module: "@mintsourcejs/mdxjs-react", namedImports: ["MdxScopeProvider"] }))
            .toEqual('import {MdxScopeProvider} from "@mintsourcejs/mdxjs-react";');
    });
});