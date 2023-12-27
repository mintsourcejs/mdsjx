/**
 * Merge a set of import specifications, stripping out duplicates etc.
 * 
 * @param {Array} importSpecs an array of import specifications. 
 * @returns {Array} an array of merged import specifications.
 */
export function mergeImports(importSpecs) {
    const mergedImports = importSpecs.reduce((result, statement) => {
        const module = result[statement.module] || (result[statement.module] = {module: statement.module});

        // only assign defaultImport if not already assigned.
        if (statement.defaultImport && !module.defaultImport) {
            module.defaultImport = statement.defaultImport;
        }

        // if there are any named imports, merge them.
        if (statement.namedImports) {
            module.namedImports || (module.namedImports = []);
            for (const namedImport of statement.namedImports) {
                if (typeof namedImport === "object") {
                    if (!module.namedImports.find(namedImportSpec => namedImportSpec.name === namedImport.name && namedImportSpec.alias === namedImportSpec.alias)) {
                        module.namedImports.push(namedImport);
                    }
                } else {
                    if (!module.namedImports.find(namedImportSpec => namedImportSpec.name === namedImport)) {
                        module.namedImports.push({ name: namedImport });
                    }    
                }
            }
        }

        return result;
    }, {});

    return Object.keys(mergedImports).map((mergedImport) => {
        return mergedImports[mergedImport];
    });
}