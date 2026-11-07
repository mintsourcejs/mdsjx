import type { PropsWithChildren } from "react";

import { ButtonBase } from "../ButtonBase";
import styles from "./Button.module.css";

export const Button = ({ children }: PropsWithChildren) => {
    return <ButtonBase className={styles.btnB}>{children}</ButtonBase>;
};