import clsx from "clsx";

import styles from "./ButtonBase.module.css";

export const ButtonBase = ({ children, className, ...props }) => {
    return <button className={clsx(styles.btn, className)} {...props}>{children}</button>
}