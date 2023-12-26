import { ButtonBase } from "../ButtonBase.jsx";
import styles from "./Button.module.css";

export const Button = ({ children }) => {
    return <ButtonBase className={styles.btnB}>{children}</ButtonBase>;
};