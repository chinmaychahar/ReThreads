import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api';
import { account } from '../../config/appwrite';

const DonateForm = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'general',
    itemCondition: 'good',
    size: 'M',
    gender: 'unisex',
    city: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const jwt = await account.createJWT();
      const res = await fetch(`${API_BASE_URL}/api/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt.jwt}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit donation');
      }
      history.push('/donations');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="container my-5 py-3">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <h2 className="text-center mb-4">Donate Clothing</h2>
          <p className="text-muted text-center mb-4">
            Your donated clothes will be converted into adaptive clothing by our volunteers.
          </p>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Item Title</label>
              <input type="text" className="form-control" name="title" value={form.title} onChange={handleChange} required minLength={3} placeholder="e.g. Blue cotton shirt" />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea className="form-control" name="description" value={form.description} onChange={handleChange} required minLength={10} rows={3} placeholder="Describe the item, fabric, any wear..." />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Category (best fit for)</label>
                <select className="form-select" name="category" value={form.category} onChange={handleChange}>
                  <option value="general">General Adaptive</option>
                  <option value="alzheimers">Alzheimer's</option>
                  <option value="parkinsons">Parkinson's</option>
                  <option value="cerebral_palsy">Cerebral Palsy</option>
                  <option value="elderly">Elderly</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Condition</label>
                <select className="form-select" name="itemCondition" value={form.itemCondition} onChange={handleChange}>
                  <option value="new">New (with tags)</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Size</label>
                <select className="form-select" name="size" value={form.size} onChange={handleChange}>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Gender</label>
                <select className="form-select" name="gender" value={form.gender} onChange={handleChange}>
                  <option value="unisex">Unisex</option>
                  <option value="women">Women</option>
                  <option value="men">Men</option>
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">City</label>
                <input type="text" className="form-control" name="city" value={form.city} onChange={handleChange} placeholder="Your city" />
              </div>
            </div>
            <button type="submit" className="btn btn-warning w-100" disabled={loading}>
              {loading ? 'Submitting...' : 'Donate Item'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DonateForm;
