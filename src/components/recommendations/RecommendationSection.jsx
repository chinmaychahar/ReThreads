import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api';

const RecommendationSection = ({ productId }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!productId) return;
    const fetchRecs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/recommendations/${productId}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products);
        }
      } catch {}
    };
    fetchRecs();
  }, [productId]);

  if (products.length === 0) return null;

  return (
    <div className="container mt-5">
      <h4 className="mb-3">You might also like</h4>
      <div className="row">
        {products.map((item) => (
          <div className="col-md-3 mb-3" key={item.$id}>
            <div className="card h-100">
              <img src={item.img} className="card-img-top" alt={item.title} style={{height: '180px', objectFit: 'cover'}} />
              <div className="card-body text-center">
                <h6 className="card-title">{item.title}</h6>
                <p className="small">{item.price} INR</p>
                <NavLink to={`/allProducts/${item.$id}`} className="btn btn-sm btn-outline-warning">View</NavLink>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationSection;
