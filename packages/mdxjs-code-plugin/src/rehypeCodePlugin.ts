import { mergeImports, renderImport, type ImportSpec } from "@mintsourcejs/mdxjs-common";
import type { ElementContent, Root } from "hast";
import rehypeSlug, { type Options as SlugOptions } from "rehype-slug";
import { mangleDefaultIdentifier, mangleNamedIdentifier, mangleNamespaceIdentifier } from "./mangleName.js";
import { processCodeElements } from "./processCodeElements.js";
import { createMdxjsEsmNode, createMdxJsxFlowElement } from "./rehypeUtils.js";

export interface RehypeCodePluginOptions {
    /** provide code meta data to the component as `data-meta` prop. */
    meta?: boolean;
    /**
     * add an `id` to each heading, slugged from its text (default `true`). Headings that already have an `id` are
     * left alone. Pass `rehype-slug` options to configure it, e.g. `{ prefix: "doc-" }`.
     */
    slug?: boolean | SlugOptions;
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
            if (opts.slug !== false) {
                rehypeSlug(typeof opts.slug === "object" ? opts.slug : undefined)(tree);
            }

            const codeImportSpecs = processCodeElements(tree, { meta: opts.meta });

            // deduplicate imports extracted from ALL code elements.
            const mergedCodeImportSpecs = mergeImports(codeImportSpecs);

            const { mangledImportSpecs, mangledIdentifiers } = mergedCodeImportSpecs.reduce((result, importSpec) => {
                const mangledImportSpec: ImportSpec = {
                    defaultImport: importSpec.defaultImport && mangleDefaultIdentifier(importSpec.module),
                    namespaceImport: importSpec.namespaceImport && mangleNamespaceIdentifier(importSpec.module),
                    namedImports: importSpec.namedImports && [],
                    module: importSpec.module
                };

                if (mangledImportSpec.defaultImport) {
                    result.mangledIdentifiers.push(mangledImportSpec.defaultImport);
                }

                if (mangledImportSpec.namespaceImport) {
                    result.mangledIdentifiers.push(mangledImportSpec.namespaceImport);
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
