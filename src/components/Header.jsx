import React from 'react'
import { NavLink } from 'react-router-dom'
import CartBtn from './buttons/CartBtn'
import './button.css'

const Header = () => {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-expand-sm sticky-top navbar-light bg-light">
                <div className="container-fluid py-2">
                    
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <NavLink style={{cursor:"none"}} className="header-text navbar-brand fw-bold" to="/">ReThreads</NavLink>
                    
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
                        </ul>
                    <CartBtn/>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header
