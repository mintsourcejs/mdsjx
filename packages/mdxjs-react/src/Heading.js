import PropTypes from "prop-types";
import React from "react";
import { LinkIcon } from "./icons/LinkIcon.js";

import styles from "./Heading.module.css";

export const Heading = ({ children, id, tag: Tag }) => {
    return (
        <Tag id={id} className={styles.heading}>
            {id ? <a className={styles.link} aria-hidden="true" tabIndex="-1" href={`#${id}`}><LinkIcon /></a> : null}
            {children}
        </Tag>
    );
}

Heading.propTypes = {
    children: PropTypes.node,
    id: PropTypes.string,
    tag: PropTypes.string
};

Heading.defaultProps = {
    tag: "h1"
};
