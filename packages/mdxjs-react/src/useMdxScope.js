import { useContext } from "react";
import { MdxScopeContext } from "./MdxScopeContext";

export function useMdxScope() {
    const scope = useContext(MdxScopeContext);
    return scope;
}
