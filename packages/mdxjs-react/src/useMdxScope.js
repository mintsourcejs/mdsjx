import { useContext, useMemo } from "react";
import { MdxScopeContext } from "./MdxScopeContext";

export function useMdxScope(scopeMapping) {
    const globalScope = useContext(MdxScopeContext);

    const scope = useMemo(() => {
        return Object.entries(scopeMapping).reduce((result, [localName, alias]) => {
            result[localName] = globalScope[alias];
            return result;
        }, {});
    }, [globalScope, scopeMapping])

    return scope;
}
