import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config/api';
import { account } from '../../config/appwrite';

const AdminDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const getHeaders = async () => {
    const jwt = await account.createJWT();
    return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jwt.jwt}` };
  };

  const fetchData = async () => {
    try {
      const headers = await getHeaders();
      const [donRes, ordRes, msgRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/donations/quality_check`, { headers }),
        fetch(`${API_BASE_URL}/api/admin/orders`, { headers }),
        fetch(`${API_BASE_URL}/api/admin/messages`, { headers }),
      ]);
      if (donRes.ok) setDonations((await donRes.json()).donations);
      if (ordRes.ok) setOrders((await ordRes.json()).orders);
      if (msgRes.ok) setMessages((await msgRes.json()).messages);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      const headers = await getHeaders();
      await fetch(`${API_BASE_URL}/api/admin/donations/${id}/approve`, { method: 'PATCH', headers });
      await fetchData();
    } catch {}
    setActionLoading(null);
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      const headers = await getHeaders();
      await fetch(`${API_BASE_URL}/api/admin/donations/${id}/reject`, { method: 'PATCH', headers });
      await fetchData();
    } catch {}
    setActionLoading(null);
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

  return (
    <div className="container my-5 py-3">
      <h2 className="mb-4">Admin Dashboard</h2>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center border-warning">
            <div className="card-body">
              <h3 className="text-warning">{donations.length}</h3>
              <p>Pending Quality Check</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h3>{orders.length}</h3>
              <p>Total Orders</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h3>{messages.filter(m => m.status === 'unread').length}</h3>
              <p>Unread Messages</p>
            </div>
          </div>
        </div>
      </div>

      <h4 className="mt-4 mb-3">Donations Awaiting Approval</h4>
      {donations.length === 0 ? (
        <p className="text-muted">No donations pending approval.</p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr><th>Title</th><th>Category</th><th>Condition</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d.$id}>
                  <td>{d.title}</td>
                  <td>{d.category}</td>
                  <td>{d.itemCondition}</td>
                  <td>
                    <button className="btn btn-sm btn-success me-2" onClick={() => handleApprove(d.$id)} disabled={actionLoading === d.$id}>
                      Approve & List
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleReject(d.$id)} disabled={actionLoading === d.$id}>
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h4 className="mt-5 mb-3">Contact Messages</h4>
      {messages.length === 0 ? (
        <p className="text-muted">No messages.</p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Message</th><th>Status</th></tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m.$id}>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td>{m.message.substring(0, 50)}...</td>
                  <td><span className={`badge bg-${m.status === 'unread' ? 'danger' : 'success'}`}>{m.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
