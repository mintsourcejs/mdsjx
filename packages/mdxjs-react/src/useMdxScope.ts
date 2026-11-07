import { useContext, useMemo } from "react";
import { MdxScopeContext, type MdxScope } from "./MdxScopeContext.js";

/** maps the local names used in a code block to their mangled identifiers in the scope. */
export type ScopeMapping = Record<string, string>;

export function useMdxScope(scopeMapping?: ScopeMapping | null): MdxScope {
    const globalScope = useContext(MdxScopeContext);

    const scope = useMemo(() => {
        return Object.entries(scopeMapping ?? {}).reduce<MdxScope>((result, [localName, alias]) => {
            result[localName] = globalScope[alias];
            return result;
        }, {});
    }, [globalScope, scopeMapping])

    return scope;
}
