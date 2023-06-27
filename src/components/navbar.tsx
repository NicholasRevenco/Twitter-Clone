import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';

import { auth } from '../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { OwnPosts } from '../pages/main/ownPosts';
import styles from '../styles/Navbar.module.css'
import { Link } from 'react-router-dom';

export const RealNavbar = () => {
    const [user, loading, error] =  useAuthState(auth);

    const signOutUser = async () => {
        await signOut(auth);
    }

    return (
        <>
            {!user ? (
                <div>
                    <nav className="navbar navbar-expand-sm navbar-light bg-light fixed-top">
                        <div className={` ${[styles.needLoginLogin]}`}>
                            <Link className="btn btn-dark mt-2 mb-2" to="/login">Login</Link>
                        </div>
                    </nav>
                </div>
            ) : (
                <>
                    <Navbar bg="light" expand={"md"} className={` ${["fixed-top"]} ${[styles.navPadding]}`}>
                    <Container fluid>
                    <Link className={` ${[styles.navUserInfo]}`} to="/ownPosts">
                        <img className="rounded" width="50px" src={user?.photoURL || ""} />
                        <p className={` ${[styles.username]}`} >{user?.displayName}</p>
                    </Link>
                        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${"md"}`} />
                        <Navbar.Offcanvas
                        id={`offcanvasNavbar-expand-${"md"}`}
                        aria-labelledby={`offcanvasNavbarLabel-expand-${"md"}`}
                        placement="end"
                        >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${"md"}`}>
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                        <Nav className={` ${["navbar-nav"]} ${["me-auto"]} ${[styles.navItemsContainer]} `}>
                                <ul className={` ${["navbar-nav"]} ${[styles.center]} ${[styles.navItemsContainer]} `}>
                                    <li className="nav-item pt-3 mb-3">
                                        <Link className={` ${[styles.navItems]} `} to="/">Home</Link>
                                    </li>
                                    <li className="nav-item pt-3 mb-3">
                                        <Link className={` ${[styles.navItems]}`} to="/createPost">Create Post</Link>
                                    </li>
                                    <li className="nav-item pt-3 mb-3">
                                        <Link className={` ${[styles.navItems]}`} to="/ownPosts">Your Posts</Link>
                                    </li>
                                </ul>
                            </Nav>
                            <Nav>     
                                <form className={` ${[styles.center]} ${["mt-2"]}`}>
                                    <button className={` ${["btn"]} ${["btn-dark"]} ${[styles.logOutBtn]} `} onClick={signOutUser}>Log Out</button>
                                </form>
                            </Nav>
                        </Offcanvas.Body>
                        </Navbar.Offcanvas>
                    </Container>
                    </Navbar>
                </>
            )}
        </>
    );
}

export default RealNavbar;
