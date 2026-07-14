import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api';
import { account } from '../../config/appwrite';

const BuyerRequestForm = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    category: 'general',
    adaptiveType: '',
    size: '',
    medicalCondition: '',
    urgency: 'medium',
    maxBudget: '',
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
      const body = { ...form };
      if (!body.adaptiveType) delete body.adaptiveType;
      if (!body.size) delete body.size;
      if (!body.medicalCondition) delete body.medicalCondition;
      if (body.maxBudget) body.maxBudget = parseFloat(body.maxBudget);
      else delete body.maxBudget;

      const res = await fetch(`${API_BASE_URL}/api/buyer-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jwt.jwt}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit request');
      }
      history.push('/buyer-requests');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="container my-5 py-3">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4">Request Adaptive Clothing</h2>
          <p className="text-muted text-center mb-4">Tell us what you need — we'll notify you when a matching item becomes available.</p>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select className="form-select" name="category" value={form.category} onChange={handleChange}>
                <option value="general">General Adaptive</option>
                <option value="alzheimers">Alzheimer's</option>
                <option value="parkinsons">Parkinson's</option>
                <option value="cerebral_palsy">Cerebral Palsy</option>
                <option value="elderly">Elderly</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Adaptive Type (optional)</label>
              <select className="form-select" name="adaptiveType" value={form.adaptiveType} onChange={handleChange}>
                <option value="">Any</option>
                <option value="magnetic_closure">Magnetic Closure</option>
                <option value="velcro">Velcro</option>
                <option value="side_zip">Side Zip</option>
                <option value="open_back">Open Back</option>
                <option value="elastic_waist">Elastic Waist</option>
                <option value="front_flap">Front Flap</option>
                <option value="pull_on">Pull On</option>
              </select>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Size (optional)</label>
                <select className="form-select" name="size" value={form.size} onChange={handleChange}>
                  <option value="">Any</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Urgency</label>
                <select className="form-select" name="urgency" value={form.urgency} onChange={handleChange}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Max Budget (INR, optional)</label>
              <input type="number" className="form-control" name="maxBudget" value={form.maxBudget} onChange={handleChange} placeholder="e.g. 500" />
            </div>
            <button type="submit" className="btn btn-warning w-100" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BuyerRequestForm;
