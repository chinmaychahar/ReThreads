import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedProducts } from '../redux/actions/productActions';
import GoToTop from './GoToTop';

const Product = () => {
    const dispatch = useDispatch();
    const { featured, loading } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchFeaturedProducts());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="container text-center py-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <h2 className="section-title">Top Featured</h2>
            <div className="product-grid">
                {featured.map((item) => {
                    const itemId = item.$id || item.id;
                    return (
                        <div className="card" key={itemId}>
                            <img src={item.img} className="card-img-top" alt={item.title}/>
                            <div className="card-body text-center">
                                <h5 className="card-title">{item.title}</h5>
                                <p className="text-price mb-3">{item.price} INR</p>
                                <NavLink to={`/products/${itemId}`} className="btn btn-outline-warning btn-sm">Buy Now</NavLink>
                            </div>
                        </div>
                    );
                })}
            </div>
            <GoToTop/>
        </div>
    )
}

export default Product
