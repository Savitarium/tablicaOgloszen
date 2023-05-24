import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import styles from './NavBar.module.scss';
import { getUserLogin } from '../../redux/usersRedux';
import { useSelector } from 'react-redux';

const NavBar = () => {
    const [userLogin, setUserLogin] = useState(null);

    const reduxUserLogin = useSelector(getUserLogin);

    useEffect(() => {
        setUserLogin(reduxUserLogin);
    }, [reduxUserLogin]);

    return (
        <div>
            <Navbar variant="dark" expand="lg" className={styles.bgprimary}>
                <Nav className="me-auto">
                    <Navbar.Brand as={NavLink} to="/" className="ms-4">
                        Ads Board
                    </Navbar.Brand>
                </Nav>
                <Nav className="justify-content-end mx-4">
                    <Nav.Link as={NavLink} to="/">
                        Home
                    </Nav.Link>
                    {userLogin === null && (
                        <Nav.Link as={NavLink} to="/login">
                        Login
                    </Nav.Link> )}
                    {userLogin === null && (
                        <Nav.Link as={NavLink} to="/register">
                            Register
                        </Nav.Link> )}
                    {userLogin !== null && (
                        <Nav.Link as={NavLink} to="/add">
                            Add
                        </Nav.Link>
                    )}
                    {userLogin !== null && (
                        <Nav.Link as={NavLink} to="/logout">
                            Log out
                        </Nav.Link>
                    )}
                </Nav>
            </Navbar>
        </div>
    );
};

export default NavBar;
