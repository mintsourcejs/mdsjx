export function mangleDefaultIdentifier(module) {
    const mangledModule = mangleModuleName(module);
    return `default_${mangledModule}`;
}

export function mangleModuleName(module) {
    return module
        .replaceAll(/([@\-\.\/])/g, (match, c) => {            
            return `\$${c.charCodeAt(0)}\$`;
        });
}

export function mangleNamedIdentifier(localName, module) {
    const mangledModule = mangleModuleName(module);
    return `_${localName}_${mangledModule}`;
}