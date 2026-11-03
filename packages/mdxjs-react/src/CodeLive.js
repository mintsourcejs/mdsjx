import { extractImports } from "@mintsourcejs/mdxjs-common";
import classnames from "classnames";
import { themes } from "prism-react-renderer";
import PropTypes from "prop-types";
import React, { useMemo, useState } from "react";
import { LiveEditor, LiveError, LivePreview, LiveProvider } from "react-live";
import { EmbedIcon } from "./icons/EmbedIcon.js";
import { useMdxScope } from "./useMdxScope.js";

import styles from "./CodeLive.module.css";

export const CodeLive = ({ code, noInline, scopeMapping, theme = themes.vsDark }) => {
    const scope = useMdxScope(scopeMapping);

    const imports = useMemo(() => extractImports(code), [code]);

    // if there are any imports, strip them out of the code block.
    const raw = imports.length > 0 
        ? code.replace(/import\s+.*?["'][^"']+["'];?/gs, '').trim() 
        : code;

    const [open, setOpen] = useState(false);

    return (
        <LiveProvider code={raw} scope={scope} theme={theme} noInline={noInline}>
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

CodeLive.propTypes = {
    code: PropTypes.string.isRequired,
    noInline: PropTypes.bool,
    scopeMapping: PropTypes.objectOf(PropTypes.string),
    theme: PropTypes.object
};
