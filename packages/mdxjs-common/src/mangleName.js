export function mangleName(localName, module) {
    const mangledModule = module.replaceAll("@", "__");
    return `_${localName}_${mangledModule}`;
}