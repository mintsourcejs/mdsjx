import { compile } from "@mdx-js/mdx";
import type { Root } from "hast";
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

describe("rehypeCodePlugin should", () => {
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
