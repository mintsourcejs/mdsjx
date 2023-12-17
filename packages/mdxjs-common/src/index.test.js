import { extractImports, importParser, mergeImports } from "./codeUtils";

describe("extract imports", () => {
    it("should extract an import", () => {
        const imports = extractImports("import myDefault from 'my-module';");
        expect(imports).toEqual([{module: "my-module", defaultImport: "myDefault"}]);
    });

    it("should extract multiline import", () => {
        const imports = extractImports(`import {
    one,
    two
} from "my-module";`);
        expect(imports).toEqual([{module: "my-module", namedImports: ["one", "two"]}]);
    });

    it("should extract multiple imports", () => {
        const imports = extractImports("import myDefault from 'my-module';import {one} from 'my-other-module';");
        expect(imports).toEqual([
            {module: "my-module", defaultImport: "myDefault"},
            {module: "my-other-module", namedImports: ["one"]}
        ]);
    });
});

describe("importParser parses", () => {
    it("only default import", () => {
        const result = importParser("import Numbers from 'numbers';");
        expect(result.module).toBe("numbers");
        expect(result.defaultImport).toBe("Numbers");
        expect(result.namedImports).toBe(undefined);
    });

    it("only named imports", () => {
        const result = importParser("import {One, Two, Three} from 'numbers';");
        expect(result.module).toBe("numbers");
        expect(result.defaultImport).toBe(undefined);
        expect(result.namedImports).toEqual(["One", "Two", "Three"]);
    });

    it("both default and named imports", () => {
        const result = importParser("import Numbers, {One, Two, Three} from 'numbers';");
        expect(result.module).toBe("numbers");
        expect(result.defaultImport).toBe("Numbers");
        expect(result.namedImports).toEqual(["One", "Two", "Three"]);
    });

    it("files", () => {
        const result = importParser("import 'numbers/style.css';");
        expect(result.module).toBe("numbers/style.css");
    });
});

describe("mergeImports should", () => {
    it("merge default and named imports from the same module", () => {
        const result = mergeImports([{
            module: "react",
            defaultImport: "React"
        }, {
            module: "react",
            namedImports: ["Component"]
        }]);

        expect(result.length).toBe(1);
        expect(result[0].module).toBe("react");
        expect(result[0].defaultImport).toBe("React");
        expect(result[0].namedImports).toEqual(["Component"]);
    });
});
