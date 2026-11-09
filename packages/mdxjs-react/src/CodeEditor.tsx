import { Highlight, themes } from "prism-react-renderer";
import React, { memo, useContext, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { LiveContext } from "react-live";
import { useEditable } from "use-editable";
import type { CodeLiveProps } from "./CodeLive.js";

import styles from "./CodeLive.module.css";

export interface CodeEditorProps extends Required<Pick<CodeLiveProps, "code" | "indent">> {
    onChange: (code: string) => void;
}

// `LiveEditor` always indents by 2 spaces, so the editor is built on the hook it uses instead. It's memoized because
// `useEditable` restores the selection whenever it renders, which would take the focus from whatever now has it.
export const CodeEditor = memo(({ code, indent, onChange }: CodeEditorProps) => {
    const { language = "tsx", theme = themes.vsDark } = useContext(LiveContext);

    const editorRef = useRef<HTMLPreElement>(null);
    const [value, setValue] = useState(code);

    useEffect(() => setValue(code), [code]);

    useEditable(editorRef, text => {
        // the editor's text always ends with a newline, which isn't part of the code.
        const newValue = text.slice(0, -1);
        setValue(newValue);
        onChange(newValue);
    }, { indentation: indent });

    // Tab indents, so Escape has to be the way out for anyone using a keyboard.
    const handleKeyDown = (event: KeyboardEvent<HTMLPreElement>) => {
        if (event.key === "Escape") {
            event.currentTarget.blur();
        }
    };

    return (
        <div className={styles.editor}>
            <Highlight code={value} language={language} theme={theme}>
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre aria-keyshortcuts="Escape" aria-label="Code editor" className={className} onKeyDown={handleKeyDown} ref={editorRef} spellCheck={false} style={{...style, margin: 0, padding: 10}}>
                        {tokens.map((line, i) => (
                            <span key={i} {...getLineProps({ line })}>
                                {line.filter(token => !token.empty).map((token, key) => (
                                    <span key={key} {...getTokenProps({ token })} />
                                ))}
                                {"\n"}
                            </span>
                        ))}
                    </pre>
                )}
            </Highlight>
            <div className={styles.editorHint}>Press Esc to leave the editor</div>
        </div>
    );
});

CodeEditor.displayName = "CodeEditor";
