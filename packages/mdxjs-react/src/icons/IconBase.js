import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import styles from "./Icon.module.css";

export const IconBase = React.forwardRef(({ children, className, inline, spin, ...props }, ref) => {
    const Tag = inline ? "svg" : "symbol";

    const classes = classnames(styles.icon, {
        [styles.spin]: !!spin
    }, className);

    return (
        <Tag className={classes} {...props} ref={ref}>
            {children}
        </Tag>
    );
});

IconBase.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    inline: PropTypes.bool
};

IconBase.defaultProps = {
    inline: true
};
