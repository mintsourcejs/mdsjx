import type { ImportSpecInput, NamedImportSpec } from "./types.js";

function renderNamedImport(namedImport: NamedImportSpec | string): string {
    if (typeof namedImport === "object") {
        // names that aren't valid identifiers, such as `{"a-b" as ab}`, have to be strings.
        const name = /^[\p{ID_Start}$_][\p{ID_Continue}$]*$/u.test(namedImport.name) ? namedImport.name : JSON.stringify(namedImport.name);
        if (namedImport.alias) {
            return `${name} as ${namedImport.alias}`;
        }
        return name;
    }
    return namedImport;
}

export function renderImport(importSpec: ImportSpecInput): string {
    const source = `"${importSpec.module}";`;
    const namespaceImport = importSpec.namespaceImport && `* as ${importSpec.namespaceImport}`;
    const namedImports = importSpec.namedImports?.length ? `{${importSpec.namedImports.map(renderNamedImport).join(', ')}}` : undefined;

    function renderStatement(...bindings: (string | undefined)[]) {
        const present = bindings.filter(Boolean);
        return present.length ? `import ${present.join(", ")} from ${source}` : `import ${source}`;
    }

    // a namespace import can't share a statement with named imports, which can happen once imports are merged.
    if (namespaceImport && namedImports) {
        return `${renderStatement(importSpec.defaultImport, namespaceImport)}\n${renderStatement(namedImports)}`;
    }

    return renderStatement(importSpec.defaultImport, namespaceImport ?? namedImports);
}
