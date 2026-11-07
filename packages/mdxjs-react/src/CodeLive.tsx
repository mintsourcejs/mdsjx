import classnames from "classnames";
import { themes, type PrismTheme } from "prism-react-renderer";
import React, { useState } from "react";
import { LiveEditor, LiveError, LivePreview, LiveProvider } from "react-live";
import { EmbedIcon } from "./icons/EmbedIcon.js";
import { useMdxScope, type ScopeMapping } from "./useMdxScope.js";

import styles from "./CodeLive.module.css";

export interface CodeLiveProps {
    /** the code to run, which can't include import statements. */
    code: string;
    noInline?: boolean;
    scopeMapping?: ScopeMapping | null;
    theme?: PrismTheme;
}

export const CodeLive = ({ code, noInline, scopeMapping, theme = themes.vsDark }: CodeLiveProps) => {
    const scope = useMdxScope(scopeMapping);

    const [open, setOpen] = useState(false);

    return (
        <LiveProvider code={code} scope={scope} theme={theme} noInline={noInline}>
            <div className={styles.codeLive}>
                <div className={styles.codeExample}>
                    <LivePreview /><LiveError />
                </div>
                <div className={styles.codeControls}><button className={styles.iconButton} onClick={() => setOpen(open => !open)}><EmbedIcon /></button></div>
                <div className={classnames(styles.collapse, {[styles.open]: open})}>
                    <LiveEditor />
                </div>
            </div>
        </LiveProvider>
    );    
};
