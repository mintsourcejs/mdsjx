import { compile } from "@mdx-js/mdx";
import type { Properties, Root } from "hast";
import { visit } from "unist-util-visit";
import { describe, expect, it } from "vitest";
import { rehypeCodePlugin, type RehypeCodePluginOptions } from "./index.js";

type Transformer = () => (tree: Root) => void;

/** compile the MDX and return the id of each heading, running any `before` plugins ahead of rehypeCodePlugin. */
async function headingIds(mdx: string, opts?: RehypeCodePluginOptions, before: Transformer[] = []) {
    const ids: unknown[] = [];
    const collectIds: Transformer = () => tree => {
        visit(tree, "element", node => {
            if (/^h[1-6]$/.test(node.tagName)) {
                ids.push(node.properties.id);
            }
        });
    };

    await compile(mdx, { rehypePlugins: [...before, rehypeCodePlugin(opts), collectIds] });
    return ids;
}

/** compile the MDX, returning the generated code and the properties of each code element. */
async function compileCode(mdx: string) {
    const properties: Properties[] = [];
    const collectProperties: Transformer = () => tree => {
        visit(tree, "element", node => {
            if (node.tagName === "code") {
                properties.push(node.properties);
            }
        });
    };

    const output = await compile(mdx, { rehypePlugins: [rehypeCodePlugin(), collectProperties] });
    return { code: String(output), properties };
}

/** compile the MDX and return the type of each node at the root, and those of the provider's children. */
async function rootNodeTypes(mdx: string) {
    let root: string[] = [];
    let provider: string[] = [];
    const collectTypes: Transformer = () => tree => {
        root = tree.children.map(node => node.type);
        const scopeProvider = tree.children.find(node => node.type === "mdxJsxFlowElement");
        provider = scopeProvider?.children.map(node => node.type) ?? [];
    };

    await compile(mdx, { rehypePlugins: [rehypeCodePlugin(), collectTypes] });
    return { root, provider };
}

describe("rehypeCodePlugin should", () => {
    it("import and scope the imports of a code block", async () => {
        const { code, properties } = await compileCode("```jsx live\nimport D, {a as b} from 'm';\n<D />\n```");

        expect(code).toContain('import default_m, {a as _a_m} from "m";');
        expect(properties[0]?.["data-scope"]).toBe(JSON.stringify({ D: "default_m", b: "_a_m" }));
    });

    it("provide the offset of the code following the imports", async () => {
        const { code, properties } = await compileCode("```jsx live\nimport a from 'a';\n<b />\n```");

        expect(properties[0]?.["data-code-start"]).toBe("18");
        expect(code).toContain('"data-code-start": "18"');
    });

    it("not provide an offset without imports", async () => {
        const { properties } = await compileCode("```jsx live\n<b />\n```");

        expect(properties[0]).not.toHaveProperty("data-code-start");
    });

    it("support namespace imports", async () => {
        const { code, properties } = await compileCode("```jsx live\nimport * as N from 'm';\n<N.A />\n```");

        expect(code).toContain('import * as namespace_m from "m";');
        expect(properties[0]?.["data-scope"]).toBe(JSON.stringify({ N: "namespace_m" }));
    });

    it("support namespace and named imports of a module across code blocks", async () => {
        const { code } = await compileCode("```jsx live\nimport * as N from 'm';\n```\n\n```jsx live\nimport {a} from 'm';\n```");

        expect(code).toContain('import * as namespace_m from "m";');
        expect(code).toContain('import {a as _a_m} from "m";');
    });

    it("support string names", async () => {
        const { code } = await compileCode("```jsx live\nimport {'a-b' as ab} from 'm';\n```");

        expect(code).toContain('import {"a-b" as _a$45$b_m} from "m";');
    });

    it("leave out type only imports but provide their offset", async () => {
        const { code, properties } = await compileCode("```tsx live\nimport type {P} from 'm';\n<b />\n```");

        expect(code).not.toContain('from "m"');
        expect(properties[0]?.["data-scope"]).toBe("{}");
        expect(properties[0]?.["data-code-start"]).toBe("25");
    });

    it("ignore import statements in other languages", async () => {
        const { code, properties } = await compileCode("```python title=example\nimport a from 'a'\n```");

        expect(code).not.toContain('from "a"');
        expect(properties[0]?.["data-scope"]).toBe("{}");
        expect(properties[0]).not.toHaveProperty("data-code-start");
    });

    it("keep the imports of a document out of the provider", async () => {
        const { root, provider } = await rootNodeTypes("import a from 'a'\n\nimport b from 'b'");

        expect(root).toEqual(["mdxjsEsm", "mdxjsEsm", "mdxjsEsm", "mdxJsxFlowElement"]);
        expect(provider).not.toContain("mdxjsEsm");
    });

    it("keep a single import out of the provider", async () => {
        const { root, provider } = await rootNodeTypes("import a from 'a'");

        expect(root).toEqual(["mdxjsEsm", "mdxjsEsm", "mdxJsxFlowElement"]);
        expect(provider).not.toContain("mdxjsEsm");
    });

    it("keep imports separated from each other out of the provider, moving the content into it", async () => {
        const { root, provider } = await rootNodeTypes("import a from 'a'\n\nimport b from 'b'\n\n# Example");

        expect(root).toEqual(["mdxjsEsm", "mdxjsEsm", "mdxjsEsm", "mdxJsxFlowElement"]);
        expect(provider).toContain("element");
        expect(provider).not.toContain("mdxjsEsm");
    });

    it("add slugged ids to headings", async () => {
        expect(await headingIds("# Getting started here\n\n###### Deep, *nested* heading!")).toEqual([
            "getting-started-here",
            "deep-nested-heading",
        ]);
    });

    it("slug headings containing inline code and links", async () => {
        expect(await headingIds("## Using `CodeLive` with [links](https://example.com)")).toEqual([
            "using-codelive-with-links",
        ]);
    });

    it("give duplicate headings unique ids", async () => {
        expect(await headingIds("# Example\n\n# Example\n\n# Example")).toEqual(["example", "example-1", "example-2"]);
    });

    it("not change ids that are already set", async () => {
        const setId: Transformer = () => tree => {
            visit(tree, "element", node => {
                node.properties.id = "custom";
            });
        };
        expect(await headingIds("# Example", undefined, [setId])).toEqual(["custom"]);
    });

    it("apply rehype-slug options", async () => {
        expect(await headingIds("# Example", { slug: { prefix: "doc-" } })).toEqual(["doc-example"]);
    });

    it("not add ids when slug is false", async () => {
        expect(await headingIds("# Example", { slug: false })).toEqual([undefined]);
    });
});
