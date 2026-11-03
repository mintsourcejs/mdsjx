import React from "react";

/** the values available to live code blocks, keyed by their mangled identifiers. */
export type MdxScope = Record<string, unknown>;

export const MdxScopeContext = React.createContext<MdxScope>({});
