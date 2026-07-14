import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api';
import { account } from '../../config/appwrite';

const STATUS_LABELS = {
  received: { label: 'Received', color: 'info' },
  assigned: { label: 'Assigned to Volunteer', color: 'primary' },
  converting: { label: 'Being Converted', color: 'warning' },
  converted: { label: 'Converted', color: 'success' },
  quality_check: { label: 'Quality Check', color: 'secondary' },
  listed: { label: 'Listed for Sale', color: 'success' },
  rejected: { label: 'Needs Rework', color: 'danger' },
};

const DonationTracker = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const jwt = await account.createJWT();
        const res = await fetch(`${API_BASE_URL}/api/donations/mine`, {
          headers: { 'Authorization': `Bearer ${jwt.jwt}` },
        });
        if (res.ok) {
          const data = await res.json();
          setDonations(data.donations);
        } else {
          setError('Failed to load donations.');
        }
      } catch (err) {
        setError('Failed to load donations. Please try again later.');
      }
      setLoading(false);
    };
    fetchDonations();
  }, []);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5 py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Donations</h2>
        <NavLink to="/donate" className="btn btn-warning">+ Donate Item</NavLink>
      </div>
      {donations.length === 0 ? (
        <p className="text-muted text-center">No donations yet. <NavLink to="/donate">Donate your first item</NavLink></p>
      ) : (
        <div className="row">
          {donations.map((d) => {
            const statusInfo = STATUS_LABELS[d.status] || { label: d.status, color: 'secondary' };
            const history = JSON.parse(d.statusHistory || '[]');
            return (
              <div className="col-md-6 mb-4" key={d.$id}>
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{d.title}</h5>
                    <span className={`badge bg-${statusInfo.color} mb-2`}>{statusInfo.label}</span>
                    <p className="card-text text-muted small">{d.description.substring(0, 100)}...</p>
                    <p className="small mb-1"><strong>Category:</strong> {d.category}</p>
                    <p className="small mb-2"><strong>Condition:</strong> {d.itemCondition}</p>
                    <h6 className="mt-3">Timeline</h6>
                    <ul className="list-unstyled small">
                      {history.map((h, i) => (
                        <li key={i} className="mb-1">
                          <span className={`badge bg-${STATUS_LABELS[h.status]?.color || 'secondary'} me-2`}>
                            {STATUS_LABELS[h.status]?.label || h.status}
                          </span>
                          {new Date(h.timestamp).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DonationTracker;
