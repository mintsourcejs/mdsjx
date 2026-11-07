import React, { type ReactNode } from "react";
import { MdxScopeContext, type MdxScope } from "./MdxScopeContext.js";

export interface MdxScopeProviderProps {
    children?: ReactNode;
    value: MdxScope;
}

export const MdxScopeProvider = ({ children, value }: MdxScopeProviderProps) => {
    return (
        <MdxScopeContext.Provider value={value}>
            {children}
        </MdxScopeContext.Provider>
    );
};
