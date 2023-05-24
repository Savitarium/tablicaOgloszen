import { Navbar } from "react-bootstrap";
import styles from "./Footer.module.scss"

const NavBar = () => {
    return (
        <div>
            <Navbar variant="dark" expand="lg" className={styles.bgprimary}>
                        <p className={styles.p}>Copyright © Nadar Vlkan</p>
            </Navbar>
        </div>
    )
}

export default NavBar;