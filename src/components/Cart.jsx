import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { removeFromCart } from '../redux/actions/cartActions'
import { NavLink } from 'react-router-dom'
import GoToTop from './GoToTop'

const Cart = () => {
    const { items } = useSelector((state) => state.cart)
    const dispatch = useDispatch()

    const handleClose = (item) => {
        dispatch(removeFromCart(item.productId))
    }

    const cartItems = (cartItem) => {
        return(
            <div className="px-4 my-5 bg-light rounded-3" key={cartItem.productId}>
                <div className="container py-4">
                    <button onClick={() => handleClose(cartItem)} className="btn-close float-end" aria-label="Close"></button>
                    <div className="row justify-content-center">
                        <div className="col-md-4">
                            <img src={cartItem.img} alt={cartItem.title} height="200px" width="180px" />
                        </div>
                        <div className="col-md-4">
                            <h3>{cartItem.title}</h3>
                            <p className="lead fw-bold">{cartItem.price} INR</p>
                            <p className="text-muted">Qty: {cartItem.quantity}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const emptyCart = () => {
        return (
            <div className="px-4 my-5 bg-light rounded-3 py-5">
                <div className="container py-4">
                    <div className="row">
                        <h3>Your Cart is Empty</h3>
                    </div>
                </div>
            </div>
        );
    }

    const button = () => {
        return(
            <div className="container">
                <div className="row">
                    <NavLink to="/checkout" className="btn btn-outline-warning mb-5 w-25 mx-auto">Proceed To checkout</NavLink>
                </div>
                <GoToTop/>
            </div>
        );
    }

    return (
        <>
            {items.length === 0 && emptyCart()}
            {items.length !== 0 && items.map(cartItems)}
            {items.length !== 0 && button()}
        </>
    )
}

export default Cart
