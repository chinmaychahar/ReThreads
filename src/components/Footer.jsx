import React from 'react'
import { NavLink } from 'react-router-dom'
import './footer.css';

const Footer = () => {
    return (
        <footer>
            <div className="container">
                <div className="footer-container">
                    <div className="footer-left">
                        <h3>ReThreads</h3>
                        <ul>
                            <li>Adaptive clothing made affordable through sustainable donations.</li>
                        </ul>
                    </div>
                    <div className="footer-left">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><NavLink to="/products" style={{color: 'rgba(255,255,255,0.7)'}}>Shop</NavLink></li>
                            <li><NavLink to="/about" style={{color: 'rgba(255,255,255,0.7)'}}>About</NavLink></li>
                            <li><NavLink to="/contact" style={{color: 'rgba(255,255,255,0.7)'}}>Contact</NavLink></li>
                        </ul>
                    </div>
                    <div className="footer-left">
                        <h3>Contact</h3>
                        <ul>
                            <li>project.rethreads@gmail.com</li>
                        </ul>
                    </div>
                </div>
                <div style={{borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '32px', paddingTop: '16px', textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)'}}>
                    &copy; 2025 ReThreads. All rights reserved.
                </div>
            </div>
        </footer>
    )
}

export default Footer
