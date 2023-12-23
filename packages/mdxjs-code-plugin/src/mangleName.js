export function mangleName(localName, module) {
    const mangledModule = module
        .replaceAll("@", "__")
        .replaceAll("-", "_");
    return `_${localName}_${mangledModule}`;
}