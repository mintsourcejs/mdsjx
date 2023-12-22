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

    function processNamedImport(namedImport) {
        const split = namedImport.split(/\s+as\s+/);
        if (split.length > 1) {
            return { name: split[0], alias: split[1] };
        }
        return { name: namedImport };
    }

    const imports = statement.match(/^import\s+([^\{][^\s,]*)\s*,\s*\{([^\}]*)\}\s+from\s+["'](.*)["'];?$/);
    if (imports) {
        const namedImports = imports[2].trim().split(/\s*,\s*/).map(processNamedImport);
        return {defaultImport: imports[1], namedImports, module: imports[3]};
    }

    const namedImports = statement.match(/^import\s+\{([^\}]*)\}\s+from\s+["'](.*)["'];?$/);
    if (namedImports) {
        namedImports[1] = namedImports[1].trim().split(/\s*,\s*/).map(processNamedImport);
        return {namedImports: namedImports[1], module: namedImports[2]};
    }

    const fileImports = statement.match(/^import\s+["'](.*)["'];?$/);
    if (fileImports) {
        return {module: fileImports[1]};
    }

    return null;
}
