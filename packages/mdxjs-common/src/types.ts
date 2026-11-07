export interface NamedImportSpec {
    alias?: string;
    name: string;
}

export interface ImportSpec {
    defaultImport?: string;
    namespaceImport?: string;
    namedImports?: NamedImportSpec[];
    module: string;
}

/**
 * An import specification as accepted by `mergeImports` and `renderImport`, where named imports may also be given
 * as plain strings.
 */
export interface ImportSpecInput extends Omit<ImportSpec, "namedImports"> {
    namedImports?: (NamedImportSpec | string)[];
}
