import { importParser } from "./importParser.js";

export function extractImports(code) {
    const match = code.match(/import\s+.*?["'][^"']+["'];?/gs);
    if (match) {
        return match.map(importParser);
    }

    return [];
}