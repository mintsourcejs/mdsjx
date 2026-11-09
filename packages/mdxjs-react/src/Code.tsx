import { Highlight, themes, type PrismTheme } from "prism-react-renderer";
import React, { useMemo, type ReactNode } from "react";
import { CodeLive } from "./CodeLive.js";
import { nodeToText } from "./nodeToText.js";
import { parseMeta } from "./parseMeta.js";
import type { ScopeMapping } from "./useMdxScope.js";

export interface CodeProps {
    children?: ReactNode;
    className?: string;
    /** the number of spaces the Tab key indents by in a live code block, unless its meta string has an `indent`. */
    indent?: number;
    language?: string;
    theme?: PrismTheme;
    /** the code block's meta string, added by `@mintsourcejs/mdxjs-code-plugin`. */
    "data-meta"?: string;
    /** the code block's scope mapping as JSON, added by `@mintsourcejs/mdxjs-code-plugin`. */
    "data-scope"?: string;
    /** the offset of the code following the code block's imports, added by `@mintsourcejs/mdxjs-code-plugin`. */
    "data-code-start"?: string;
}

export const Code = ({ children, className, indent, language, theme = themes.vsDark, ["data-meta"]: dataMeta, ["data-scope"]: dataScope, ["data-code-start"]: dataCodeStart }: CodeProps) => {
    const meta = useMemo(() => parseMeta(dataMeta), [dataMeta]);
    const scope = useMemo(() => dataScope ? JSON.parse(dataScope) as ScopeMapping : undefined, [dataScope]);
    
    // no language specified? extract one from the className if possible.
    language ||= className?.substr('language-'.length);

    const code = nodeToText(children).replace(/(\s+)$/, '');

    if (!language) {
        return <code>{code}</code>;
    }

    if (meta.live) {
        // imports aren't valid in a live code block, they are provided by the scope.
        const liveCode = code.slice(Number(dataCodeStart ?? 0)).trim();
        const liveIndent = typeof meta.indent === "string" ? Number(meta.indent) : indent;
        return <CodeLive code={liveCode} indent={liveIndent} noInline={!!meta.noInline} scopeMapping={scope} theme={theme} />;
    }

    return (
        <Highlight code={code} language={language} theme={theme}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={className} style={{...style, padding: "10px"}}>
                    {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line })}>
                            {line.map((token, key) => (
                                <span key={key} {...getTokenProps({ token })} />
                            ))}
                        </div>
                    ))}
                </pre>
            )}
        </Highlight>
    );
};
