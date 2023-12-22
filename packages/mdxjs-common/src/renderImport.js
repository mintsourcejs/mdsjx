export function renderImport(importSpec) {
    let result = "import ";

    if (importSpec.defaultImport) {
        result+= importSpec.defaultImport;
        if (importSpec.namedImports && importSpec.namedImports.length) {
            result+=", ";
        }
    }

    if (importSpec.namedImports && importSpec.namedImports.length) {
        const namedImports = importSpec.namedImports.map(namedImport => {
            if (typeof namedImport === "object" && namedImport.alias) {
                return `${namedImport.name} as ${namedImport.alias}`;
            }
            return namedImport.name;
        });
        result+= `{${namedImports.join(', ')}}`;
    }

    if (importSpec.defaultImport || (importSpec.namedImports && importSpec.namedImports.length)) {
        result+= " from ";
    }

    result+= `"${importSpec.module}";`;

    return result;
};