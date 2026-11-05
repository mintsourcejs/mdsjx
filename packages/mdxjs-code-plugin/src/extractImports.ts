import type { ImportSpec, NamedImportSpec } from "@mintsourcejs/mdxjs-common";
import { tsPlugin } from "@sveltejs/acorn-typescript";
import { Parser, tokTypes, type AnyNode, type ImportDeclaration, type Options, type TokenType } from "acorn";

export interface ExtractedImports {
    /** the imports that exist at runtime, so excluding any that are type only. */
    imports: ImportSpec[];
    /** the offset at which the imports end and the rest of the code begins. */
    end: number;
}

/** the parts of acorn's parser, missing from its type declarations, needed to parse a statement at a time. */
interface StatementParser {
    lastTokEnd: number;
    type: TokenType;
    nextToken(): void;
    parseStatement(context: null, topLevel: boolean, exports: object): AnyNode;
}

/** set by the TypeScript plugin on import declarations and specifiers. */
interface TypeOnly {
    importKind?: "type" | "value";
}

const TypeScriptParser = Parser.extend(tsPlugin()) as unknown as new (options: Options, code: string) => StatementParser;
const options: Options = { ecmaVersion: "latest", sourceType: "module", locations: true };

/**
 * Extract the imports from the beginning of a code block. Parsing stops at the first statement that isn't an import
 * (or a directive), so the rest of the block can be anything: JSX, TypeScript, a partial snippet or invalid code.
 *
 * @param code the source of a code block.
 * @return the imports and where they end.
 */
export function extractImports(code: string): ExtractedImports {
    const { declarations, end } = parseLeadingImports(code);
    return { imports: declarations.map(toImportSpec).filter(importSpec => importSpec !== null), end };
}

function parseLeadingImports(code: string): { declarations: ImportDeclaration[], end: number } {
    const parser = new TypeScriptParser(options, code);
    const declarations: ImportDeclaration[] = [];
    let end = 0;

    try {
        parser.nextToken();
        while (parser.type === tokTypes._import || parser.type === tokTypes.string) {
            const statement = parser.parseStatement(null, true, {});
            if (statement.type === "ImportDeclaration") {
                declarations.push(statement);
                end = statement.end;
            } else if (!(statement.type === "ExpressionStatement" && statement.expression.type === "Literal")) {
                break;
            }
        }
    } catch {
        // the parser reads one token past each statement, so what follows can fail a complete import. Retry without
        // the offending token: each attempt is shorter, ending once the failure is at the end of the code.
        if (parser.lastTokEnd < code.length) {
            return parseLeadingImports(code.slice(0, parser.lastTokEnd));
        }
    }

    return { declarations, end };
}

function toImportSpec(declaration: ImportDeclaration & TypeOnly): ImportSpec | null {
    if (declaration.importKind === "type") {
        return null;
    }

    const importSpec: ImportSpec = { module: declaration.source.value as string };
    const namedImports: NamedImportSpec[] = [];

    for (const specifier of declaration.specifiers) {
        if (specifier.type === "ImportDefaultSpecifier") {
            importSpec.defaultImport = specifier.local.name;
        } else if (specifier.type === "ImportNamespaceSpecifier") {
            importSpec.namespaceImport = specifier.local.name;
        } else if ((specifier as TypeOnly).importKind !== "type") {
            const name = specifier.imported.type === "Identifier" ? specifier.imported.name : specifier.imported.value as string;
            namedImports.push(specifier.local.name === name ? { name } : { name, alias: specifier.local.name });
        }
    }

    if (namedImports.length > 0) {
        importSpec.namedImports = namedImports;
    }

    // every specifier was type only, so there is nothing to import at runtime.
    const typeOnly = declaration.specifiers.length > 0
        && !importSpec.defaultImport && !importSpec.namespaceImport && !importSpec.namedImports;

    return typeOnly ? null : importSpec;
}
