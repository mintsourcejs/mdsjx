import { mergeImports, renderImport, type ImportSpec } from "@mintsourcejs/mdxjs-common";
import type { ElementContent, Root } from "hast";
import { mangleDefaultIdentifier, mangleNamedIdentifier } from "./mangleName.js";
import { processCodeElements } from "./processCodeElements.js";
import { createMdxjsEsmNode, createMdxJsxFlowElement } from "./rehypeUtils.js";

export interface RehypeCodePluginOptions {
    /** provide code meta data to the component as `data-meta` prop. */
    meta?: boolean;
}

/**
 * Plugin to collect imports from the whole document and stuff them into a provider.
 * 
 * @param opts the configuration options.
 */
export function rehypeCodePlugin(opts?: RehypeCodePluginOptions): () => (tree: Root) => void {
    opts = { ...opts };
    return () => {
        return (tree: Root) => {
            const codeImportSpecs = processCodeElements(tree, { meta: opts.meta });

            // deduplicate imports extracted from ALL code elements.
            const mergedCodeImportSpecs = mergeImports(codeImportSpecs);

            const { mangledImportSpecs, mangledIdentifiers } = mergedCodeImportSpecs.reduce((result, importSpec) => {
                const mangledImportSpec: ImportSpec = {
                    defaultImport: importSpec.defaultImport && mangleDefaultIdentifier(importSpec.module),
                    namedImports: importSpec.namedImports && [],
                    module: importSpec.module
                };

                if (mangledImportSpec.defaultImport) {
                    result.mangledIdentifiers.push(mangledImportSpec.defaultImport);
                }
                
                importSpec.namedImports?.forEach(namedImportSpec => {                 
                    const mangledName = mangleNamedIdentifier(namedImportSpec.name, importSpec.module);
                    mangledImportSpec.namedImports?.push({
                        name: namedImportSpec.name,
                        alias: mangledName
                    });
                    result.mangledIdentifiers.push(mangledName);
                });
                result.mangledImportSpecs.push(mangledImportSpec);

                return result;
            }, {mangledImportSpecs: [] as ImportSpec[], mangledIdentifiers: [] as string[]});

            // generate the source code for the import statements from our deduped list.   
            const importSrc = [{ module: "@mintsourcejs/mdxjs-react", namedImports: ["MdxScopeProvider"] }, ...mangledImportSpecs]
                .map(importSpec => renderImport(importSpec))
                .join("\n");

            const importsNode = createMdxjsEsmNode(importSrc);

            // parse a scope provider with the array of local identifiers passed as a value property
            const valueSrc = `{${mangledIdentifiers.join(",")}}`;
            const scopeProvider = createMdxJsxFlowElement(`<MdxScopeProvider value={${valueSrc}}></MdxScopeProvider>`);

            const index = tree.children.findIndex(node => node.type !== "mdxjsEsm");

            const body = tree.children.splice(index, tree.children.length, importsNode, scopeProvider);
            // an MDX document's body never contains a doctype, the one root node that can't be an element child.
            scopeProvider.children.push(...body as ElementContent[]);
        }
    }
}
