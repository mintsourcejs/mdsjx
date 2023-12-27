import { extractImports, importParser, mergeImports } from "./index.js";

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
        expect(imports).toEqual([{
            module: "my-module", 
            namedImports: [
                { name: "one" }, 
                { name: "two" }
            ]
        }]);
    });

    it("should extract multiple imports", () => {
        const imports = extractImports("import myDefault from 'my-module';import {one} from 'my-other-module';");
        expect(imports).toEqual([
            {module: "my-module", defaultImport: "myDefault"},
            {module: "my-other-module", namedImports: [
                { name: "one" }
            ]}
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
        expect(result).toEqual({
            module: "numbers",
            namedImports: [
                { name: "One" },
                { name: "Two" },
                { name: "Three" }
            ]
        });
    });

    it("both default and named imports", () => {
        const result = importParser("import Numbers, {One, \nTwo, Three as ThreeAlias} from 'numbers';");
        expect(result).toEqual({
            module: "numbers",
            defaultImport: "Numbers",
            namedImports: [
                { name: "One" },
                { name: "Two" },
                { name: "Three", alias: "ThreeAlias" }
            ]
        });
    });

    it("named import with alias", () => {
        const result = importParser("import {One as OneAlias} from 'numbers';");
        expect(result).toEqual({
            module: "numbers",
            namedImports: [
                { name: "One", alias: "OneAlias" },
            ]
        });
    });

    it("files", () => {
        const result = importParser("import 'numbers/style.css';");
        expect(result.module).toBe("numbers/style.css");
    });
});