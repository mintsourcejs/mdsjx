import { themes, type PrismTheme } from "prism-react-renderer";
import React from "react";
import { LiveProvider } from "react-live";
import { CodeLiveContent } from "./CodeLiveContent.js";
import { useMdxScope, type ScopeMapping } from "./useMdxScope.js";

export interface CodeLiveProps {
    /** the code to run, which can't include import statements. */
    code: string;
    /** the number of spaces the Tab key indents by. Set to 0 to leave Tab moving focus. */
    indent?: number;
    noInline?: boolean;
    /** whether the code editor starts open. */
    openDefault?: boolean;
    scopeMapping?: ScopeMapping | null;
    theme?: PrismTheme;
}

export const CodeLive = ({ code, indent = 2, noInline, openDefault = true, scopeMapping, theme = themes.vsDark }: CodeLiveProps) => {
    const scope = useMdxScope(scopeMapping);

    return (
        <LiveProvider code={code} scope={scope} theme={theme} noInline={noInline}>
            <CodeLiveContent code={code} indent={indent} openDefault={openDefault} />
        </LiveProvider>
    );
};
