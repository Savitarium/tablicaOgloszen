import {Button} from "react-bootstrap";
import styles from "./Button.module.scss";
const AppButton = props => {
    return (
        <Button variant="primary" className={styles.button} onClick={props.onClick}>{props.children}</Button>
    )
}
export default AppButton;