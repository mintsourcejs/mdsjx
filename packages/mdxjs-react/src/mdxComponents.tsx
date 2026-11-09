import classnames from "classnames";
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
    // a div, because MDX wraps JSX written inline with text in a paragraph, and a component rendering a block element
    // there would be invalid inside a p. The role keeps it a paragraph to assistive technology.
    p: ({ className, ...props }: ComponentProps<"div">) => <div role="paragraph" {...props} className={classnames(styles.p, className)} />,
    code: Code
};
