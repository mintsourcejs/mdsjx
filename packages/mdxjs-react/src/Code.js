import { Highlight } from "prism-react-renderer";
import { themes } from "prism-react-renderer";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { CodeLive } from "./CodeLive.js";
import { parseMeta } from "./parseMeta.js";

export const Code = ({ children, className, language, theme, ...props }) => {
    const meta = useMemo(() => parseMeta(props["data-meta"]), [props["data-meta"]]);
    
    // no language specified? extract one from the className if possible.
    language || (language = className?.substr('language-'.length));

    const code = children.replace(/(\s+)$/, '');

    if (!language) {
        return <code>{code}</code>;
    }

    if (meta.live) {
        return <CodeLive className={className} code={code} language={language} {...meta} />;
    }

    return (
        <Highlight code={code} language={language} theme={theme}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={className} style={{...style, padding: "10px"}}>
                    {tokens.map((line, i) => (
                        <div {...getLineProps({ line, key: i })}>
                            {line.map((token, key) => (
                                <span {...getTokenProps({ token, key })} />
                            ))}
                        </div>
                    ))}
                </pre>
            )}
        </Highlight>
    );
};

Code.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    language: PropTypes.string,
    theme: PropTypes.object
};

Code.defaultProps = {
    theme: themes.vsDark
};
