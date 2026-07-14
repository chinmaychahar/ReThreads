import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api';
import { account } from '../../config/appwrite';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const jwt = await account.createJWT();
        const res = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
          headers: { 'Authorization': `Bearer ${jwt.jwt}` },
        });
        if (res.ok) {
          setOrder(await res.json());
        }
      } catch (err) {
        // Handle error
      }
      setLoading(false);
    };
    fetchOrder();
  }, [id]);

  if (loading || !order) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const items = JSON.parse(order.items);
  const address = JSON.parse(order.shippingAddress);

  return (
    <div className="container my-5 py-3">
      <h2>Order #{order.orderNumber}</h2>
      <span className={`badge bg-${order.status === 'confirmed' ? 'success' : 'danger'} mb-3`}>
        {order.status}
      </span>

      <div className="row mt-4">
        <div className="col-md-8">
          <h5>Items</h5>
          {items.map((item, i) => (
            <div key={i} className="d-flex align-items-center mb-3 border-bottom pb-2">
              <img src={item.img} alt={item.title} width="60" className="me-3" />
              <div>
                <p className="mb-0 fw-bold">{item.title}</p>
                <small>{item.price} INR x {item.quantity}</small>
              </div>
            </div>
          ))}
        </div>
        <div className="col-md-4">
          <h5>Summary</h5>
          <p>Subtotal: {order.subtotal} INR</p>
          <p>GST (18%): {order.gst} INR</p>
          <p>Shipping: {order.shipping === 0 ? 'Free' : `${order.shipping} INR`}</p>
          <p className="fw-bold">Total: {order.total} INR</p>

          <h5 className="mt-4">Shipping To</h5>
          <p>{address.firstName} {address.lastName}<br/>
            {address.address}<br/>
            {address.city}, {address.state} {address.zip}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
