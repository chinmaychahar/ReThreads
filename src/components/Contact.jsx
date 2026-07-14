import React, { useState } from 'react'
import { API_BASE_URL } from '../config/api';
import GoToTop from './GoToTop'

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to send message');
            }
            setSuccess(true);
            setForm({ name: '', email: '', message: '' });
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <div>
            <div className="container mb-5">
                <div className="row">
                    <div className="col-12 text-center py-4 my-4">
                        <h1 className="con-head">Get in Touch</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-5 d-flex justify-content-center">
                        <img src="/assets/images/about.jpeg" alt="Contact Us" height="300px" width="500px" />
                    </div>
                    <div className="col-md-6">
                        {success && <div className="alert alert-success">Message sent! We'll get back to you soon.</div>}
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Full Name</label>
                                <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required minLength={2} placeholder="Your name.."/>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email address</label>
                                <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required placeholder="Your email id.."/>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Drop your thoughts below!</label>
                                <textarea className="form-control" name="message" value={form.message} onChange={handleChange} required minLength={10} rows="5" placeholder="We would love to have you as a volunteer/donater.."></textarea>
                            </div>
                            <button type="submit" className="btn btn-outline-warning" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <GoToTop/>
        </div>
    )
}

export default Contact
