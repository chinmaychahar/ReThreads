import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/actions/authActions'
import CartBtn from './buttons/CartBtn'
import './button.css'

const Header = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-expand-sm sticky-top navbar-light bg-light">
                <div className="container-fluid py-2">

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <NavLink style={{cursor:"pointer"}} className="header-text navbar-brand fw-bold" to="/">ReThreads</NavLink>

                        <ul className="navbar-nav mx-auto mb-0 mb-lg-0">
                            <li className="nav-item">
                                <NavLink className="nav-texts nav-link " to="/" exact={true}>Home</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-texts nav-link" to="/products">Products</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-texts nav-link" to="/about">About</NavLink>
                            </li>
                            {user && (
                                <li className="nav-item">
                                    <NavLink className="nav-texts nav-link" to="/orders">Orders</NavLink>
                                </li>
                            )}
                            {user && user.profile?.role === 'donor' && (
                                <li className="nav-item">
                                    <NavLink className="nav-texts nav-link" to="/donate">Donate</NavLink>
                                </li>
                            )}
                            {user && user.profile?.role === 'donor' && (
                                <li className="nav-item">
                                    <NavLink className="nav-texts nav-link" to="/donations">My Donations</NavLink>
                                </li>
                            )}
                            {user && user.profile?.role === 'buyer' && (
                                <li className="nav-item">
                                    <NavLink className="nav-texts nav-link" to="/buyer-requests">Requests</NavLink>
                                </li>
                            )}
                            {user && user.profile?.role === 'volunteer' && (
                                <li className="nav-item">
                                    <NavLink className="nav-texts nav-link" to="/volunteer">Dashboard</NavLink>
                                </li>
                            )}
                            {user && user.profile?.role === 'admin' && (
                                <li className="nav-item">
                                    <NavLink className="nav-texts nav-link" to="/admin">Admin</NavLink>
                                </li>
                            )}
                        </ul>
                    <div className="d-flex align-items-center">
                        <CartBtn/>
                        {user ? (
                            <button onClick={handleLogout} className="btn btn-outline-secondary btn-sm ms-2">
                                Logout
                            </button>
                        ) : (
                            <NavLink to="/login" className="btn btn-outline-warning btn-sm ms-2">
                                Login
                            </NavLink>
                        )}
                    </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header
