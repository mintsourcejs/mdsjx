import { describe, expect, it } from "vitest";
import { extractImports } from "./extractImports.js";

const imports = (code: string) => extractImports(code).imports;

/** the code that remains once the imports are removed. */
const body = (code: string) => code.slice(extractImports(code).end).trim();

describe("extractImports should parse", () => {
    it("a default import", () => {
        expect(imports("import Numbers from 'numbers';")).toEqual([{ module: "numbers", defaultImport: "Numbers" }]);
    });

    it("named imports", () => {
        expect(imports("import {One, Two, Three} from 'numbers';")).toEqual([{
            module: "numbers",
            namedImports: [{ name: "One" }, { name: "Two" }, { name: "Three" }]
        }]);
    });

    it("default and named imports", () => {
        expect(imports("import Numbers, {One, \nTwo, Three as ThreeAlias} from 'numbers';")).toEqual([{
            module: "numbers",
            defaultImport: "Numbers",
            namedImports: [{ name: "One" }, { name: "Two" }, { name: "Three", alias: "ThreeAlias" }]
        }]);
    });

    it("a default import used as a named import", () => {
        expect(imports("import {default as Numbers} from 'numbers';")).toEqual([{
            module: "numbers",
            namedImports: [{ name: "default", alias: "Numbers" }]
        }]);
    });

    it("string names", () => {
        expect(imports("import {'a-b' as AB} from 'numbers';")).toEqual([{
            module: "numbers",
            namedImports: [{ name: "a-b", alias: "AB" }]
        }]);
    });

    it("namespace imports", () => {
        expect(imports("import * as Numbers from 'numbers';")).toEqual([{ module: "numbers", namespaceImport: "Numbers" }]);
    });

    it("default and namespace imports", () => {
        expect(imports("import Numbers, * as All from 'numbers';")).toEqual([{
            module: "numbers",
            defaultImport: "Numbers",
            namespaceImport: "All"
        }]);
    });

    it("side effect imports", () => {
        expect(imports("import 'numbers/style.css';")).toEqual([{ module: "numbers/style.css" }]);
        expect(imports("import {} from 'numbers';")).toEqual([{ module: "numbers" }]);
    });

    it("multiline imports with trailing commas and comments", () => {
        expect(imports(`import {
    one, // the first
    /* two, */
    three,
} from "my-module";`)).toEqual([{ module: "my-module", namedImports: [{ name: "one" }, { name: "three" }] }]);
    });

    it("multiple imports, with or without semicolons", () => {
        expect(imports("import a from 'a';import {b} from 'b'\nimport c from 'c'")).toEqual([
            { module: "a", defaultImport: "a" },
            { module: "b", namedImports: [{ name: "b" }] },
            { module: "c", defaultImport: "c" }
        ]);
    });

    it("imports with attributes", () => {
        const code = "import data from './data.json' with {type: 'json'};\n<A />";
        expect(imports(code)).toEqual([{ module: "./data.json", defaultImport: "data" }]);
        expect(body(code)).toBe("<A />");
    });

    it("imports after comments and directives", () => {
        expect(imports("// a comment\n'use client';\n/* another */\nimport a from 'a';")).toEqual([{ module: "a", defaultImport: "a" }]);
    });
});

describe("extractImports should exclude type only imports", () => {
    it.each([
        "import type {A} from 'a';",
        "import type A from 'a';",
        "import type * as A from 'a';",
        "import {type A} from 'a';",
        "import {type A, type B as C} from 'a';",
    ])("%s", statement => {
        const code = `${statement}\nimport b from 'b';\n<b />`;
        expect(imports(code)).toEqual([{ module: "b", defaultImport: "b" }]);
        expect(body(code)).toBe("<b />");
    });

    it("but keep the values imported alongside them", () => {
        expect(imports("import {type A, B} from 'a';")).toEqual([{ module: "a", namedImports: [{ name: "B" }] }]);
    });

    it("but keep identifiers named type", () => {
        expect(imports("import type from 'a';")).toEqual([{ module: "a", defaultImport: "type" }]);
        expect(imports("import {type} from 'a';")).toEqual([{ module: "a", namedImports: [{ name: "type" }] }]);
        expect(imports("import {type as t} from 'a';")).toEqual([{ module: "a", namedImports: [{ name: "type", alias: "t" }] }]);
    });
});

describe("extractImports should ignore", () => {
    it.each([
        ["commented imports", "// import a from 'a';\n<div />"],
        ["imports in strings", "const s = \"import a from 'a'\";\n<div>{s}</div>"],
        ["the word import in JSX", "<p>To import a thing use \"foo\"</p>"],
        ["dynamic imports", "import('a').then(render);"],
        ["import.meta", "import.meta.url;"],
        ["imports after other code", "const a = 1;\nimport b from 'b';"],
        ["bare string expressions", "'hello'"],
        ["code that isn't JavaScript", "# a heading\nimport a from 'a'"],
        ["empty code", ""],
    ])("%s", (_, code) => {
        expect(extractImports(code)).toEqual({ imports: [], end: 0 });
    });
});

describe("extractImports should stop at the end of the imports for", () => {
    const a = [{ module: "a", defaultImport: "A" }];

    it.each([
        ["JSX", "<A />"],
        ["adjacent JSX", "<A />\n<A />"],
        ["JSX text with quotes", "<p>don't \"quote\" me</p>"],
        ["TypeScript", "const f = <T,>(x: T): T => x;\ninterface P {a: string}"],
        ["more imports in the body", "<p>import b from 'b';</p>"],
        ["invalid code", "const = ;\n<A"],
        ["text the tokenizer rejects", "# not javascript"],
        ["an unterminated string", "'oops"],
        ["an unterminated template", "`oops"],
        ["a decorator", "@foo class B {}"],
    ])("%s", (_, rest) => {
        for (const statement of ["import A from 'a';", "import A from 'a'"]) {
            const code = `${statement}\n${rest}`;
            expect(imports(code)).toEqual(a);
            expect(body(code)).toBe(rest);
        }
    });

    it("a malformed import, keeping the imports before it", () => {
        const code = "import A from 'a';\nimport {B from 'b';\n<A />";
        expect(imports(code)).toEqual(a);
        expect(body(code)).toBe("import {B from 'b';\n<A />");
    });
});
