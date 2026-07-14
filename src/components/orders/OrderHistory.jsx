import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api';
import { account } from '../../config/appwrite';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const jwt = await account.createJWT();
        const res = await fetch(`${API_BASE_URL}/api/orders`, {
          headers: { 'Authorization': `Bearer ${jwt.jwt}` },
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders);
        } else {
          setError('Failed to load orders.');
        }
      } catch (err) {
        setError('Failed to load orders. Please try again later.');
      }
      setLoading(false);
    };
    fetchOrders();
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
      <h2 className="text-center mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <p className="text-center text-muted">No orders yet. <NavLink to="/products">Start shopping</NavLink></p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.$id}>
                  <td>{order.orderNumber}</td>
                  <td>{new Date(order.$createdAt).toLocaleDateString()}</td>
                  <td>{order.total} INR</td>
                  <td>
                    <span className={`badge bg-${order.status === 'confirmed' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <NavLink to={`/orders/${order.$id}`} className="btn btn-sm btn-outline-warning">View</NavLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
