export function parseMeta(meta?: string): Record<string, string | true> {
    const parts = meta?.split(/\s+/);
    const props = parts?.reduce<Record<string, string | true>>((result, part) => {
        const [key = "", value] = part.split(/\s*=\s*/);
        result[key] = typeof value === "undefined" ? true : value;
        return result;
    }, {});
    return props || {};
}
