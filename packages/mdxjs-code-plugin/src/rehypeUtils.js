import * as acorn from "acorn";
import { fromMarkdown } from "mdast-util-from-markdown";
import { mdxJsxFromMarkdown } from "mdast-util-mdx-jsx";
import { mdxjsEsmFromMarkdown } from "mdast-util-mdxjs-esm";
import { mdxJsx } from "micromark-extension-mdx-jsx";
import { mdxjsEsm } from "micromark-extension-mdxjs-esm";

export function createMdxjsEsmNode(ecmaScript) {
    const tree = fromMarkdown(ecmaScript, {
        extensions: [mdxjsEsm({ acorn, addResult: true })],
        mdastExtensions: [mdxjsEsmFromMarkdown()]
    });

    return tree.children[0];
}

export function createMdxJsxFlowElement(jsx) {
    const tree = fromMarkdown(jsx, {
        extensions: [mdxJsx({ acorn, addResult: true })],
        mdastExtensions: [mdxJsxFromMarkdown()]
    })

    return tree.children[0];
}
