export function mangleDefaultIdentifier(module: string): string {
    const mangledModule = mangleModuleName(module);
    return `default_${mangledModule}`;
}

export function mangleModuleName(module: string): string {
    return module
        .replaceAll(/[^\p{ID_Continue}]/gu, c => {
            return `$${c.codePointAt(0)}$`;
        });
}

export function mangleNamespaceIdentifier(module: string): string {
    const mangledModule = mangleModuleName(module);
    return `namespace_${mangledModule}`;
}

export function mangleNamedIdentifier(localName: string, module: string): string {
    const mangledModule = mangleModuleName(module);
    return `_${mangleModuleName(localName)}_${mangledModule}`;
}