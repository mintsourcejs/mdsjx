import React from "react";
import { Code } from "./Code.js";
import { Heading } from "./Heading.js";

import styles from "./mdxComponents.module.css";

export const mdxComponents = {
    h1: ({ children, ...props }) => {
        // generate the id from the text given to the heading.
        const id = children.replace(" ", "_");
        return <Heading id={id} {...props} tag="h1">{children}</Heading>
    },
    h2: ({ children, ...props }) => {
        // generate the id from the text given to the heading.
        const id = children.replace(" ", "_");
        return <Heading id={id} {...props} tag="h2">{children}</Heading>
    },
    p: (props) => <div {...props} className={styles.p} />,
    code: Code
};
