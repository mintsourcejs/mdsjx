export function parseMeta(meta) {
    const parts = meta?.split(/\s+/);
    const props = parts?.reduce((result, part) => {
        const [key, value] = part?.split(/\s*=\s*/) || [];
        result[key] = typeof value === "undefined" ? true : value;
        return result;
    }, {});
    return props || {};
}
