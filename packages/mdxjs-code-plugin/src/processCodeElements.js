import { extractImports } from "@mintsourcejs/mdxjs-common";
import { visit } from "unist-util-visit";

/**
 * 
 * @param {*} tree 
 * @param {Object} [opts] configuration options.
 *   @param {boolean} [opts.meta] provide code meta data to the component as `data-meta` prop. 
 * @returns {Array} an array of import specifications. 
 */
export function processCodeElements(tree, opts) {
    opts = { ...opts };
    const allImportSpecs = [];

    // visit each `element` looking for `code` elements. For each one found, add the `data-meta` property to
    // expose the MD meta data to the code element. Extract any `import` statements from the code block. Finally,
    // add the `data-scope` property as a CSV, where each value is the local name of the import used in the 
    // code block.
    visit(tree, "element", (node, index, parent) => {
        if (node.tagName === "code" && node?.data?.meta) {

            // this is a little horrible, but for some reason, rehype / remark / mdxjs, whatever is responsible for
            // this, wraps the code tag in a PRE tag and we don't want it. Rather than figuring out what is 
            // responsible and removing it, I figured I'd just change it to a DIV to be cheap...
            if (parent.tagName === "pre") {
                parent.tagName = "div";
            }

            // expose the markdown meta data as the "data-meta" attribute on the "code" node.
            if (opts.meta !== false) {
                node.properties["data-meta"] = node.data.meta;
            }

            // take the body value of the "code" node and extract any imports from the beginning of it
            const bodyText = node.children.reduce((result, node) => (result + node.value), "");
            const importSpecs = extractImports(bodyText);
            allImportSpecs.push(...importSpecs);

            // use the import specifications to generate a CSV value for the named module exports
            // to pass into the "data-scope" attribute on the "code" node.
            const scope = importSpecs.reduce((result, importSpec) => {
                if (importSpec.namedImports) {
                    result.push(...importSpec.namedImports);
                }
                return result;
            }, []);

            node.properties["data-scope"] = scope.join(",");                        
        }                    
    });

    return allImportSpecs;
}
