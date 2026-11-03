import { Highlight, themes, type PrismTheme } from "prism-react-renderer";
import React, { useMemo } from "react";
import { CodeLive } from "./CodeLive.js";
import { parseMeta } from "./parseMeta.js";
import type { ScopeMapping } from "./useMdxScope.js";

export interface CodeProps {
    children: string;
    className?: string;
    language?: string;
    theme?: PrismTheme;
    /** the code block's meta string, added by `@mintsourcejs/mdxjs-code-plugin`. */
    "data-meta"?: string;
    /** the code block's scope mapping as JSON, added by `@mintsourcejs/mdxjs-code-plugin`. */
    "data-scope"?: string;
}

export const Code = ({ children, className, language, theme = themes.vsDark, ["data-meta"]: dataMeta, ["data-scope"]: dataScope }: CodeProps) => {
    const meta = useMemo(() => parseMeta(dataMeta), [dataMeta]);
    const scope = useMemo(() => dataScope ? JSON.parse(dataScope) as ScopeMapping : undefined, [dataScope]);
    
    // no language specified? extract one from the className if possible.
    language ||= className?.substr('language-'.length);

    const code = children.replace(/(\s+)$/, '');

    if (!language) {
        return <code>{code}</code>;
    }

    if (meta.live) {
        return <CodeLive code={code} noInline={!!meta.noInline} scopeMapping={scope} />;
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
