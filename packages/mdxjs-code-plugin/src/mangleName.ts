export function mangleDefaultIdentifier(module: string): string {
    const mangledModule = mangleModuleName(module);
    return `default_${mangledModule}`;
}

export function mangleModuleName(module: string): string {
    return module
        .replaceAll(/([@\-./])/g, (match, c: string) => {            
            return `$${c.charCodeAt(0)}$`;
        });
}

export function mangleNamedIdentifier(localName: string, module: string): string {
    const mangledModule = mangleModuleName(module);
    return `_${localName}_${mangledModule}`;
}