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
                                <NavLink className="nav-link" aria-current="page" to="/">Home</NavLink>
                            </li>
                            {/* <li className="nav-item"> */}
                            {/* <div class="dropdown mb-0">
                                    <button
                                        class="btn bg-light"
                                        type="button"
                                        id="dropdownMenuButton"
                                        data-mdb-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <NavLink className="nav-link" to="/products">Product</NavLink>
                                    </button>
                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <li><a class="dropdown-item" href="/products">MEN</a></li>
                                        <li><a class="dropdown-item" href="/products">WOMEN</a></li>
                                        <li><a class="dropdown-item" href="/products">DISABILITY</a></li>
                                        <li><a class="dropdown-item" href="/products">ALL PRODUCT</a></li>
                                    </ul>
                            </div> */}
                            {/* </li> */}
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/products">Products</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/about">About</NavLink>
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
