export interface NamedImportSpec {
    alias?: string;
    name: string;
}

export interface ImportSpec {
    defaultImport?: string;
    namedImports?: NamedImportSpec[];
    module: string;
}


export function extractImports(code: string): ImportSpec[];

export function importParser(statement: string): ImportSpec;

export function mergeImports(importSpecs: ImportSpec[]): ImportSpec[];

export function renderImport(importSpec: ImportSpec): string;