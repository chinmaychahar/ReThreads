import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api';
import { account } from '../../config/appwrite';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const jwt = await account.createJWT();
        const res = await fetch(`${API_BASE_URL}/api/buyer-requests/mine`, {
          headers: { 'Authorization': `Bearer ${jwt.jwt}` },
        });
        if (res.ok) {
          const data = await res.json();
          setRequests(data.requests);
        }
      } catch (err) {}
      setLoading(false);
    };
    fetchRequests();
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

  return (
    <div className="container my-5 py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Requests</h2>
        <NavLink to="/buyer-requests/new" className="btn btn-warning">+ New Request</NavLink>
      </div>
      {requests.length === 0 ? (
        <p className="text-muted text-center">No requests yet. <NavLink to="/buyer-requests/new">Create one</NavLink> and we'll notify you when a match is found.</p>
      ) : (
        <div className="row">
          {requests.map((r) => {
            const matches = JSON.parse(r.matchedProducts || '[]');
            return (
              <div className="col-md-6 mb-4" key={r.$id}>
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <h5 className="card-title">{r.category}</h5>
                      <span className={`badge bg-${r.status === 'open' ? 'success' : 'secondary'}`}>{r.status}</span>
                    </div>
                    {r.adaptiveType && <p className="small mb-1"><strong>Type:</strong> {r.adaptiveType}</p>}
                    {r.size && <p className="small mb-1"><strong>Size:</strong> {r.size}</p>}
                    <p className="small mb-1"><strong>Urgency:</strong> {r.urgency}</p>
                    {r.maxBudget && <p className="small mb-1"><strong>Budget:</strong> up to {r.maxBudget} INR</p>}
                    {matches.length > 0 && (
                      <div className="mt-3">
                        <h6 className="text-success">Matches Found ({matches.length})</h6>
                        <ul className="list-unstyled small">
                          {matches.map((m, i) => (
                            <li key={i}>
                              <NavLink to={`/allProducts/${m.productId}`}>{m.title}</NavLink>
                              <span className="text-muted ms-2">(score: {m.score})</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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

export default MyRequests;
