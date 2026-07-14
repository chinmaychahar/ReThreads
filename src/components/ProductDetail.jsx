import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../redux/actions/productActions';
import { addToCart, removeFromCart } from '../redux/actions/cartActions';
import RecommendationSection from './recommendations/RecommendationSection';
import GoToTop from './GoToTop';

const ProductDetail = () => {
    const [cartBtn, setCartBtn] = useState("Add to Cart")
    const { id } = useParams();
    const dispatch = useDispatch();
    const { currentProduct, loading } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchProductById(id));
    }, [dispatch, id]);

    const product = currentProduct;

    const handleCart = (product) => {
        if (cartBtn === "Add to Cart") {
            dispatch(addToCart(product))
            setCartBtn("Remove from Cart")
        } else {
            dispatch(removeFromCart(product.$id || product.id))
            setCartBtn("Add to Cart")
        }
    }

    if (loading || !product) {
        return (
            <div className="container text-center py-5">
                <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <>
        <div className="section-padding">
            <div className="container">
                <div className="row g-5 align-items-center">
                    <div className="col-md-6 product">
                        <img src={product.img} alt={product.title} className="product-detail-img w-100" />
                    </div>
                    <div className="col-md-6">
                        <h1 style={{fontSize: '2rem', fontWeight: 700}}>{product.title}</h1>
                        <p className="text-price" style={{fontSize: '1.5rem', margin: '16px 0'}}>{product.price} INR</p>
                        <p style={{color: 'var(--color-text-muted)', lineHeight: 1.8}}>{product.desc}</p>
                        <button onClick={() => handleCart(product)} className="btn btn-warning mt-3" style={{padding: '14px 40px'}}>
                            {cartBtn}
                        </button>
                    </div>
                </div>
                <RecommendationSection productId={id} />
            </div>
        </div>
        <GoToTop/>
        </>
    )
}

export default ProductDetail
