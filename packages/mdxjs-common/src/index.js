export function extractImports(code) {
    const match = code.match(/import\s+.*?["'][^"']+["'];?/gs);
    if (match) {
        return match.map(statement => importParser(statement));
    }

    return [];
}

/**
 * Parse a JavaScript import statement to obtain its component parts. A default import, any named imports and the
 * module from which to import.
 *
 * @param statement {String} a JavaScript import statement.
 * @return {Object} the parsed import statement or null.
 */
export function importParser(statement) {
    const defaultImport = statement.match(/^import\s+([^\{][^\s,]*)\s+from\s+["']([^"']*)["'];?$/);
    if (defaultImport) {
        return {defaultImport: defaultImport[1], module: defaultImport[2]};
    }

    const imports = statement.match(/^import\s+([^\{][^\s,]*)\s*,\s*\{([^\}]*)\}\s+from\s+["'](.*)["'];?$/);
    if (imports) {
        const namedImports = imports[2].trim().split(/\s*,\s*/);
        return {defaultImport: imports[1], namedImports, module: imports[3]};
    }

    const namedImports = statement.match(/^import\s+\{([^\}]*)\}\s+from\s+["'](.*)["'];?$/);
    if (namedImports) {
        namedImports[1] = namedImports[1].trim().split(/\s*,\s*/);
        return {namedImports: namedImports[1], module: namedImports[2]};
    }

    const fileImports = statement.match(/^import\s+["'](.*)["'];?$/);
    if (fileImports) {
        return {module: fileImports[1]};
    }

    return null;
}

export function mergeImports(imports) {
    const mergedImports = imports.reduce((result, statement) => {
        const module = result[statement.module] || (result[statement.module] = {module: statement.module});

        // only assign defaultImport if not already assigned.
        if (statement.defaultImport && !module.defaultImport) {
            module.defaultImport = statement.defaultImport;
        }

        // if there are any named imports, merge them.
        if (statement.namedImports) {
            module.namedImports || (module.namedImports = []);
            for (const namedImport of statement.namedImports) {
                if (module.namedImports.indexOf(namedImport) === -1) {
                    module.namedImports.push(namedImport);
                }
            }
        }

        return result;
    }, {});

    return Object.keys(mergedImports).map((mergedImport) => {
        return mergedImports[mergedImport];
    });
}

export function renderImport(statement) {
    let result = "import ";

    if (statement.defaultImport) {
        result+= statement.defaultImport;
        if (statement.namedImports && statement.namedImports.length) {
            result+=", ";
        }
    }

    if (statement.namedImports && statement.namedImports.length) {
        const namedImports = statement.namedImports.map(namedImport => {
            if (typeof namedImport === "object") {
                return `${namedImport.name} as ${namedImport.alias}`;
            }
            return namedImport;
        });
        result+= `{${namedImports.join(', ')}}`;
    }

    if (statement.defaultImport || (statement.namedImports && statement.namedImports.length)) {
        result+= " from ";
    }

    result+= `"${statement.module}";`;

    return result;
};