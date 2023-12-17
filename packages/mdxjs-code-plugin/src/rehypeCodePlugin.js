import { mergeImports, renderImport } from "@mintsourcejs/mdxjs-common";
import { processCodeElements } from "./processCodeElements.js";
import { createMdxjsEsmNode, createMdxJsxFlowElement } from "./rehypeUtils.js";

/**
 * Plugin to collect imports from the whole document and stuff them into a provider.
 * 
 * @param {Object} [opts] the configuration options.
 *   @param {boolean} [opts.meta] provide code meta data to the component as `data-meta` prop. 
 */
export function rehypeCodePlugin(opts) {
    opts = { ...opts };
    return () => {
        return tree => {
            const allImportSpecs = processCodeElements(tree, { meta: opts.meta });

            // deduplicate imports extracted from ALL code elements.
            const mergedImportSpecs = mergeImports(allImportSpecs);

            // build an array of all the local names of imported things.
            const allIdentifiers = mergedImportSpecs.reduce((result, importSpec) => {
                importSpec.defaultImport && (result.push(importSpec.defaultImport));
                importSpec.namedImports && (result.push(...importSpec.namedImports));
                return result;
            }, []);

            // generate the source code for the import statements from our deduped list.   
            const importSrc = [{ module: "@mintsourcejs/mdxjs-react", namedImports: ["MdxScopeProvider"] }, ...mergedImportSpecs]
                .map(importSpec => renderImport(importSpec))
                .join("\n");
        
            const importsNode = createMdxjsEsmNode(importSrc);

            // parse a scope provider with the array of local identifiers passed as a value property
            const valueSrc = `{${allIdentifiers.join(",")}}`;
            const scopeProvider = createMdxJsxFlowElement(`<MdxScopeProvider value={${valueSrc}}></MdxScopeProvider>`);

            const index = tree.children.findIndex(node => node.type !== "mdxjsEsm");

            const body = tree.children.splice(index, tree.children.length, importsNode, scopeProvider);
            scopeProvider.children.push(...body);
        }
    }
}
