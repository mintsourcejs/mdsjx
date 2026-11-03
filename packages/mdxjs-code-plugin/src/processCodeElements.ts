import { extractImports, type ImportSpec } from "@mintsourcejs/mdxjs-common";
import type { Root } from "hast";
import { visit } from "unist-util-visit";
import { mangleDefaultIdentifier, mangleNamedIdentifier } from "./mangleName.js";

// added by mdast-util-to-hast when it converts code blocks.
declare module "hast" {
    interface ElementData {
        meta?: string | null | undefined;
    }
}

export interface ProcessCodeElementsOptions {
    /** provide code meta data to the component as `data-meta` prop. */
    meta?: boolean;
}

/**
 * @param tree the document.
 * @param opts configuration options.
 * @returns an array of import specifications.
 */
export function processCodeElements(tree: Root, opts?: ProcessCodeElementsOptions): ImportSpec[] {
    opts = { ...opts };
    const allImportSpecs: ImportSpec[] = [];

    // visit each `element` looking for `code` elements. For each one found, add the `data-meta` property to
    // expose the MD meta data to the code element. Extract any `import` statements from the code block. Finally,
    // add the `data-scope` property as a CSV, where each value is the local name of the import used in the 
    // code block.
    visit(tree, "element", (node, index, parent) => {
        if (node.tagName === "code" && node?.data?.meta) {

            // this is a little horrible, but for some reason, rehype / remark / mdxjs, whatever is responsible for
            // this, wraps the code tag in a PRE tag and we don't want it. Rather than figuring out what is 
            // responsible and removing it, I figured I'd just change it to a DIV to be cheap...
            if (parent?.type === "element" && parent.tagName === "pre") {
                parent.tagName = "div";
            }

            // expose the markdown meta data as the "data-meta" attribute on the "code" node.
            if (opts.meta !== false) {
                node.properties["data-meta"] = node.data.meta;
            }

            // take the body value of the "code" node and extract any imports from the beginning of it
            const bodyText = node.children.reduce((result, node) => (result + (node.type === "text" ? node.value : "")), "");
            const importSpecs = extractImports(bodyText);
            allImportSpecs.push(...importSpecs);

            // use the import specifications to generate a CSV value for the named module exports
            // to pass into the "data-scope" attribute on the "code" node.
            const scope = importSpecs.reduce<Record<string, string>>((result, importSpec) => {
                if (importSpec.defaultImport) {
                    result[importSpec.defaultImport] = mangleDefaultIdentifier(importSpec.module);
                }

                if (importSpec.namedImports) {
                    importSpec.namedImports.forEach(namedImportSpec => {
                        result[namedImportSpec.alias || namedImportSpec.name] = mangleNamedIdentifier(namedImportSpec.name, importSpec.module);
                    });
                }
                return result;
            }, {});
            
            node.properties["data-scope"] = JSON.stringify(scope);                       
        }                    
    });

    return allImportSpecs;
}
