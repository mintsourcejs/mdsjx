import classnames from "classnames";
import React, { useCallback, useContext, useState } from "react";
import { LiveContext, LiveError, LivePreview } from "react-live";
import { CodeEditor } from "./CodeEditor.js";
import type { CodeLiveProps } from "./CodeLive.js";
import { EmbedIcon } from "./icons/EmbedIcon.js";
import { ResetIcon } from "./icons/ResetIcon.js";

import styles from "./CodeLive.module.css";

export const CodeLiveContent = ({ code, indent, openDefault }: Required<Pick<CodeLiveProps, "code" | "indent" | "openDefault">>) => {
    const { onChange } = useContext(LiveContext);

    const [open, setOpen] = useState(openDefault);
    const [edited, setEdited] = useState(false);
    // remounted to discard the edits, along with the selection `useEditable` would otherwise restore.
    const [editorKey, setEditorKey] = useState(0);

    const handleChange = useCallback((value: string) => {
        setEdited(value !== code);
        onChange(value);
    }, [code, onChange]);

    const handleReset = () => {
        setEdited(false);
        setEditorKey(key => key + 1);
        onChange(code);
    };

    return (
        <div className={styles.codeLive}>
            <div className={styles.codeExample}>
                <LivePreview /><LiveError />
            </div>
            <div className={styles.codeControls}>
                <button aria-expanded={open} aria-label="Code editor" className={styles.iconButton} onClick={() => setOpen(open => !open)} type="button">
                    <EmbedIcon aria-hidden="true" />
                </button>
                <button aria-label="Reset" className={styles.iconButton} disabled={!edited} onClick={handleReset} title="Reset" type="button">
                    <ResetIcon aria-hidden="true" />
                </button>
            </div>
            <div className={classnames(styles.collapse, {[styles.open]: open})}>
                <CodeEditor code={code} indent={indent} key={editorKey} onChange={handleChange} />
            </div>
        </div>
    );
};
