import type { MdxJsxFlowElementHast } from "mdast-util-mdx-jsx";
import type { MdxjsEsmHast } from "mdast-util-mdxjs-esm";
import * as acorn from "acorn";
import { fromMarkdown } from "mdast-util-from-markdown";
import { mdxJsxFromMarkdown } from "mdast-util-mdx-jsx";
import { mdxjsEsmFromMarkdown } from "mdast-util-mdxjs-esm";
import { mdxJsx } from "micromark-extension-mdx-jsx";
import { mdxjsEsm } from "micromark-extension-mdxjs-esm";

export function createMdxjsEsmNode(ecmaScript: string): MdxjsEsmHast {
    const tree = fromMarkdown(ecmaScript, {
        extensions: [mdxjsEsm({ acorn, addResult: true })],
        mdastExtensions: [mdxjsEsmFromMarkdown()]
    });

    return firstChild(tree) as MdxjsEsmHast;
}

export function createMdxJsxFlowElement(jsx: string): MdxJsxFlowElementHast {
    const tree = fromMarkdown(jsx, {
        extensions: [mdxJsx({ acorn, addResult: true })],
        mdastExtensions: [mdxJsxFromMarkdown()]
    })

    return firstChild(tree) as MdxJsxFlowElementHast;
}

function firstChild(tree: ReturnType<typeof fromMarkdown>) {
    const node = tree.children[0];
    if (!node) {
        throw new Error("expected the source to produce a node");
    }
    return node;
}
