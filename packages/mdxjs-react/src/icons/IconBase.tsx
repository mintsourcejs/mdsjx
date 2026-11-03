import classnames from "classnames";
import React, { type SVGAttributes } from "react";
import styles from "./Icon.module.css";

export interface IconBaseProps extends SVGAttributes<SVGElement> {
    /** render as an inline `svg` rather than a `symbol`. */
    inline?: boolean;
    spin?: boolean;
}

export const IconBase = React.forwardRef<SVGSVGElement, IconBaseProps>(({ children, className, inline = true, spin, ...props }, ref) => {
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

IconBase.displayName = "IconBase";
