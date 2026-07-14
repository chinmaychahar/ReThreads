import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { API_BASE_URL } from '../config/api'
import { account } from '../config/appwrite'
import GoToTop from './GoToTop';

const Checkout = () => {
    const { items } = useSelector((state) => state.cart)
    const history = useHistory()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [form, setForm] = useState({
        firstName: '', lastName: '', phone: '', email: '',
        address: '', city: '', state: '', zip: '',
        paymentMethod: 'credit_card',
    })

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const subtotal = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
    const gst = Math.round(subtotal * 0.18)
    const shipping = subtotal > 1000 ? 0 : 50
    const total = subtotal + gst + shipping

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            const jwt = await account.createJWT()
            const res = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt.jwt}`,
                },
                body: JSON.stringify({
                    shippingAddress: {
                        firstName: form.firstName,
                        lastName: form.lastName,
                        phone: form.phone,
                        email: form.email,
                        address: form.address,
                        city: form.city,
                        state: form.state,
                        zip: form.zip,
                    },
                    paymentMethod: form.paymentMethod,
                }),
            })
            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Order failed')
            }
            const order = await res.json()
            history.push(`/orders/${order.$id}`)
        } catch (err) {
            setError(err.message)
        }
        setLoading(false)
    }

    if (items.length === 0) {
        return (
            <div className="container my-5 text-center">
                <h3>Your cart is empty</h3>
                <p>Add some products before checking out.</p>
            </div>
        )
    }

    return (
        <>
            <div className="container my-5">
                <div className="row g-5">
                    <div className="col-md-5 col-lg-4 order-md-last">
                        <h4 className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-warning">Your cart</span>
                            <span className="badge bg-warning rounded-pill">{items.length}</span>
                        </h4>
                        <ul className="list-group mb-3">
                            {items.map((item, i) => (
                                <li key={i} className="list-group-item d-flex justify-content-between lh-sm">
                                    <div>
                                        <h6 className="my-0">{item.title}</h6>
                                        <small className="text-muted">Qty: {item.quantity || 1}</small>
                                    </div>
                                    <span className="text-muted">{item.price * (item.quantity || 1)} INR</span>
                                </li>
                            ))}
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Subtotal</span><span>{subtotal} INR</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span>GST (18%)</span><span>{gst} INR</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Shipping</span><span>{shipping === 0 ? 'Free' : `${shipping} INR`}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between fw-bold">
                                <span>Total</span><strong>{total} INR</strong>
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-7 col-lg-8">
                        <h4 className="mb-3">Shipping Address</h4>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-sm-6">
                                    <label className="form-label">First name</label>
                                    <input type="text" className="form-control" name="firstName" value={form.firstName} onChange={handleChange} required />
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label">Last name</label>
                                    <input type="text" className="form-control" name="lastName" value={form.lastName} onChange={handleChange} required />
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Phone</label>
                                    <div className="input-group">
                                        <span className="input-group-text">+91</span>
                                        <input type="text" className="form-control" name="phone" value={form.phone} onChange={handleChange} required minLength={10} />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Address</label>
                                    <input type="text" className="form-control" name="address" value={form.address} onChange={handleChange} required minLength={5} />
                                </div>
                                <div className="col-md-5">
                                    <label className="form-label">City</label>
                                    <input type="text" className="form-control" name="city" value={form.city} onChange={handleChange} required />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">State</label>
                                    <input type="text" className="form-control" name="state" value={form.state} onChange={handleChange} required />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Zip</label>
                                    <input type="text" className="form-control" name="zip" value={form.zip} onChange={handleChange} required minLength={5} />
                                </div>
                            </div>

                            <hr className="my-4" />
                            <h4 className="mb-3">Payment</h4>
                            <div className="my-3">
                                <div className="form-check">
                                    <input id="credit_card" name="paymentMethod" type="radio" className="form-check-input" value="credit_card" checked={form.paymentMethod === 'credit_card'} onChange={handleChange} />
                                    <label className="form-check-label" htmlFor="credit_card">Credit card</label>
                                </div>
                                <div className="form-check">
                                    <input id="debit_card" name="paymentMethod" type="radio" className="form-check-input" value="debit_card" checked={form.paymentMethod === 'debit_card'} onChange={handleChange} />
                                    <label className="form-check-label" htmlFor="debit_card">Debit card</label>
                                </div>
                                <div className="form-check">
                                    <input id="upi" name="paymentMethod" type="radio" className="form-check-input" value="upi" checked={form.paymentMethod === 'upi'} onChange={handleChange} />
                                    <label className="form-check-label" htmlFor="upi">UPI</label>
                                </div>
                            </div>

                            <hr className="my-4" />
                            <button className="w-100 btn btn-warning btn-lg" type="submit" disabled={loading}>
                                {loading ? 'Placing Order...' : `Place Order (${total} INR)`}
                            </button>
                        </form>
                    </div>
                </div>
                <GoToTop/>
            </div>
        </>
    )
}

export default Checkout
