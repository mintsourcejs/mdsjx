import { importParser } from "./importParser.js";
import type { ImportSpec } from "./types.js";

export function extractImports(code: string): ImportSpec[] {
    const match = code.match(/import\s+.*?["'][^"']+["'];?/gs);
    if (match) {
        // TODO: imports the parser doesn't understand (e.g. namespace imports) are skipped.
        return match.map(importParser).filter(importSpec => importSpec !== null);
    }

    return [];
}