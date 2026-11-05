import type { ImportSpec, ImportSpecInput } from "./types.js";

/**
 * Merge a set of import specifications, stripping out duplicates etc.
 * 
 * @param importSpecs an array of import specifications. 
 * @returns an array of merged import specifications.
 */
export function mergeImports(importSpecs: ImportSpecInput[]): ImportSpec[] {
    const mergedImports = importSpecs.reduce<Record<string, ImportSpec>>((result, statement) => {
        const module = result[statement.module] || (result[statement.module] = {module: statement.module});

        // only assign defaultImport if not already assigned.
        if (statement.defaultImport && !module.defaultImport) {
            module.defaultImport = statement.defaultImport;
        }

        // only assign namespaceImport if not already assigned.
        if (statement.namespaceImport && !module.namespaceImport) {
            module.namespaceImport = statement.namespaceImport;
        }

        // if there are any named imports, merge them.
        if (statement.namedImports) {
            const namedImports = module.namedImports || (module.namedImports = []);
            for (const namedImport of statement.namedImports) {
                if (typeof namedImport === "object") {
                    if (!namedImports.find(namedImportSpec => namedImportSpec.name === namedImport.name && namedImportSpec.alias === namedImport.alias)) {
                        namedImports.push(namedImport);
                    }
                } else {
                    if (!namedImports.find(namedImportSpec => namedImportSpec.name === namedImport && !namedImportSpec.alias)) {
                        namedImports.push({ name: namedImport });
                    }    
                }
            }
        }

        return result;
    }, {});

    return Object.values(mergedImports);
}