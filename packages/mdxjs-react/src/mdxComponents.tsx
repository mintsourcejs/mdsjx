import React, { type ComponentProps } from "react";
import { Code } from "./Code.js";
import { Heading, type HeadingProps } from "./Heading.js";

import styles from "./mdxComponents.module.css";

// heading ids are added by `@mintsourcejs/mdxjs-code-plugin`; without one, the heading has no anchor link.
function heading(tag: NonNullable<HeadingProps["tag"]>) {
    const Component = ({ children, id }: ComponentProps<typeof tag>) => <Heading id={id} tag={tag}>{children}</Heading>;
    Component.displayName = tag;
    return Component;
}

export const mdxComponents = {
    h1: heading("h1"),
    h2: heading("h2"),
    h3: heading("h3"),
    h4: heading("h4"),
    h5: heading("h5"),
    h6: heading("h6"),
    p: (props: ComponentProps<"div">) => <div {...props} className={styles.p} />,
    code: Code
};
