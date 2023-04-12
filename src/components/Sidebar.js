import React from  'react' ;
import './Sidebar.css'
import { elastic as Menu } from 'react-burger-menu';

// eslint-disable-next-line 
export default props => { 
    return (
        <Menu width={500}> 
            <a className="menu-item" href="/">Home</a>
            <a className="menu-item" href="/about">About</a>
            <a className="menu-item" href="/shop">Shop</a>
            <a className="menu-item" href="/contact">Contact Us</a>
        </Menu>
    );
};