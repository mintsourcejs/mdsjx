import { mergeImports } from "./mergeImports";

describe("mergeImports should", () => {
    it("merged defaultImport", () => {
        const imports = [{
            defaultImport: "TestA",
            module: "module"
        }, {
            defaultImport: "TestA",
            module: "module"
        }];

        const expected = [{
            defaultImport: "TestA",
            module: "module"
        }];

        expect(mergeImports(imports)).toEqual(expected);
    });

    it("merge namedImports (strings)", () => {
        const imports = [{
            namedImports: ["TestA", "TestC"],
            module: "module"
        }, {
            namedImports: ["TestB", "TestC"],
            module: "module"
        }];

        const expected = [{
            namedImports: [{ name: "TestA" }, { name: "TestC" }, { name: "TestB" }],
            module: "module"
        }];

        expect(mergeImports(imports)).toEqual(expected);
    });

    it("merge namedImports (NamedImportSpec)", () => {
        const imports = [{
            namedImports: [{ name: "TestA" }, { name: "TestC" }],
            module: "module"
        }, {
            namedImports: [{ name: "TestB" }, { name: "TestC" }],
            module: "module"
        }];

        const expected = [{
            namedImports: [{ name: "TestA" }, { name: "TestC" }, { name: "TestB" }],
            module: "module"
        }];

        expect(mergeImports(imports)).toEqual(expected);
    });    

    it("merge namedImports including aliases", () => {
        const imports = [{
            namedImports: [{ name: "TestA" }, { name: "TestC", alias: "AliasTestC" }],
            module: "module"
        }, {
            namedImports: [{ name: "TestB" }, { name: "TestC", alias: "AliasTestC" }],
            module: "module"
        }];

        const expected = [{
            namedImports: [{ name: "TestA" }, { name: "TestC", alias: "AliasTestC" }, { name: "TestB" }],
            module: "module"
        }];

        expect(mergeImports(imports)).toEqual(expected);
    });        
});