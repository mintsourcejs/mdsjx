import React, { type ReactNode } from "react";
import { LinkIcon } from "./icons/LinkIcon.js";

import styles from "./Heading.module.css";

export interface HeadingProps {
    children?: ReactNode;
    id?: string;
    tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const Heading = ({ children, id, tag: Tag = "h1" }: HeadingProps) => {
    return (
        <Tag id={id} className={styles.heading}>
            {id ? <a className={styles.link} aria-hidden="true" tabIndex={0} href={`#${id}`}><LinkIcon /></a> : null}
            {children}
        </Tag>
    );
}
