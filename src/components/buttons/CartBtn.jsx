import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

const CartBtn = () => {
    const { items } = useSelector((state) => state.cart)
    return (
        <>
            <NavLink to="/cart" className="btn btn-outline-warning ms-2">
                <span className="fa fa-shopping-cart me-1"></span> Cart ({items.length})
            </NavLink>
        </>
    )
}

export default CartBtn
