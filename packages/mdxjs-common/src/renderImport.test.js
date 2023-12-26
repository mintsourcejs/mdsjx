import { renderImport } from "./renderImport";

describe("renderImport should", () => {
    it("render namedImports", () => {
        expect(renderImport({ module: "@mintsourcejs/mdxjs-react", namedImports: ["MdxScopeProvider"] }))
            .toEqual('import {MdxScopeProvider} from "@mintsourcejs/mdxjs-react";');
    });
});