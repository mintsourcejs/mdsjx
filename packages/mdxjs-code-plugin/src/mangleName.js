export function mangleName(localName, module) {
    const mangledModule = module
        .replaceAll(/([@\-\.\/])/g, (match, c) => {            
            return `\$${c.charCodeAt(0)}\$`;
        });

    return `_${localName}_${mangledModule}`;
}