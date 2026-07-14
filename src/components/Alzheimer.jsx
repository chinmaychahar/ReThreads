import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByCategory } from '../redux/actions/productActions';
import GoToTop from './GoToTop';

const CATEGORY_NAMES = {
    alzheimers: "Alzheimer's",
    cerebral_palsy: "Cerebral Palsy",
    parkinsons: "Parkinson's",
    elderly: "Elderly",
};

const Clothes = () => {
    const { category } = useParams();
    const categorySlug = category || 'alzheimers';
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchProductsByCategory(categorySlug));
    }, [dispatch, categorySlug]);

    if (loading) {
        return (
            <div className="container text-center py-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container text-center py-5">
                <div className="alert alert-danger">
                    Failed to load products. Please try again later.
                </div>
            </div>
        );
    }

    const displayName = CATEGORY_NAMES[categorySlug] || categorySlug;

    return (
        <div className="section-padding">
            <div className="container">
                <h2 className="section-title">{displayName} Adaptive Store</h2>
                <div className="product-grid">
                    {items.map((item) => {
                        const itemId = item.$id || item.id;
                        return (
                            <div className="card" key={itemId}>
                                <img src={item.img} className="card-img-top" alt={item.title}/>
                                <div className="card-body text-center">
                                    <h5 className="card-title">{item.title}</h5>
                                    <p className="text-price mb-3">{item.price} INR</p>
                                    <NavLink to={`/allProducts/${itemId}`} className="btn btn-outline-warning btn-sm">Buy Now</NavLink>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <GoToTop/>
        </div>
    )
}

export default Clothes
