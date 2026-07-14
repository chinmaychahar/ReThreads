import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config/api';
import { account } from '../../config/appwrite';

const STATUS_ACTIONS = {
  assigned: { next: 'converting', label: 'Start Converting', color: 'warning' },
  converting: { next: 'converted', label: 'Mark Converted', color: 'success' },
};

const VolunteerDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const fetchAssignments = async () => {
    try {
      const jwt = await account.createJWT();
      const res = await fetch(`${API_BASE_URL}/api/volunteer/assignments`, {
        headers: { 'Authorization': `Bearer ${jwt.jwt}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAssignments(data.assignments);
      }
    } catch (err) {
      // Handle silently
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleStatusUpdate = async (donationId, newStatus) => {
    setUpdating(donationId);
    try {
      const jwt = await account.createJWT();
      const res = await fetch(`${API_BASE_URL}/api/volunteer/assignments/${donationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt.jwt}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        await fetchAssignments();
      }
    } catch (err) {
      // Handle error
    }
    setUpdating(null);
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const active = assignments.filter((a) => ['assigned', 'converting'].includes(a.status));
  const completed = assignments.filter((a) => !['assigned', 'converting'].includes(a.status));

  return (
    <div className="container my-5 py-3">
      <h2 className="mb-4">Volunteer Dashboard</h2>

      <h4 className="mb-3">Active Assignments ({active.length})</h4>
      {active.length === 0 ? (
        <p className="text-muted">No active assignments. Check back later!</p>
      ) : (
        <div className="row">
          {active.map((a) => {
            const action = STATUS_ACTIONS[a.status];
            return (
              <div className="col-md-6 mb-4" key={a.$id}>
                <div className="card border-warning">
                  <div className="card-body">
                    <h5 className="card-title">{a.title}</h5>
                    <span className={`badge bg-${a.status === 'converting' ? 'warning' : 'primary'} mb-2`}>
                      {a.status}
                    </span>
                    <p className="card-text small">{a.description.substring(0, 120)}...</p>
                    <p className="small"><strong>Category:</strong> {a.category} | <strong>Condition:</strong> {a.itemCondition} | <strong>Size:</strong> {a.size || 'N/A'}</p>
                    {action && (
                      <button
                        className={`btn btn-${action.color} btn-sm`}
                        onClick={() => handleStatusUpdate(a.$id, action.next)}
                        disabled={updating === a.$id}
                      >
                        {updating === a.$id ? 'Updating...' : action.label}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {completed.length > 0 && (
        <>
          <h4 className="mt-5 mb-3">Completed ({completed.length})</h4>
          <div className="row">
            {completed.map((a) => (
              <div className="col-md-6 mb-3" key={a.$id}>
                <div className="card">
                  <div className="card-body">
                    <h6>{a.title}</h6>
                    <span className={`badge bg-${a.status === 'listed' ? 'success' : 'secondary'}`}>{a.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default VolunteerDashboard;
