import { isValidElement, type ReactNode } from "react";

/** the text content of a React node, e.g. the code in a code block. */
export function nodeToText(node: ReactNode): string {
    if (typeof node === "string" || typeof node === "number") {
        return String(node);
    }
    if (Array.isArray(node)) {
        return node.map(nodeToText).join("");
    }
    if (isValidElement<{ children?: ReactNode }>(node)) {
        return nodeToText(node.props.children);
    }
    return "";
}
