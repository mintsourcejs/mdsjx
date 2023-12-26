export interface NamedImportSpec {
    alias?: string;
    name: string;
}

export interface ImportSpec {
    defaultImport?: string;
    namedImport?: NamedImportSpec[];
    module: string;
}


export function extractImports(code: string): ImportSpec[];

export function importParser(statment: string): ImportSpec;

export function mergeImports(importSpecs: ImportSpec[]): ImportSpec[];

export function renderImport(importSpec: ImportSpec): string;