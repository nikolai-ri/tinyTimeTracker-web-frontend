import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

import { AuthUserContext } from '../Session';

const Navigation = () => (
    <div>
        <AuthUserContext.Consumer>
            {authUser =>
                authUser ? <NavigationAuth /> : <NavigationNonAuth />
            }
        </AuthUserContext.Consumer>
    </div>
);

const NavigationAuth = () => (
    <Navbar bg="light" expand="lg">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <Nav.Link href={ROUTES.HOME}>Home</Nav.Link>
                <Nav.Link href={ROUTES.ACCOUNT}>Account</Nav.Link>
                <Nav.Link><SignOutButton /></Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
);
const NavigationNonAuth = () => (
    <Navbar bg="light" expand="lg">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <Nav.Link to={ROUTES.SIGN_IN}>Sign In</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
);
export default Navigation;