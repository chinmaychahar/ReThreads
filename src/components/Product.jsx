import React from 'react'
import { NavLink } from 'react-router-dom';
import TOPFEATURED from '../TopFeatured'

const Product = () => {

    const cardItem = (item) => {
        return (
            <div class="card my-1 py-4 mb-5" key={item.id} style={{width: "15rem", height: "27rem"}}>
                <img src={item.img} class="card-img-top" alt={item.title}/>
                    <div class="card-body text-center">
                        <h5 class="card-title">{item.title}</h5>
                        <p className="lead">{item.price} INR</p>
                        <NavLink to={`/products/${item.id}`} class="btn btn-outline-warning">Buy Now</NavLink>
                    </div>
</div>
                );
    }

                return (
                <div>
                    <div className="container mt-3 mb-0 py-5">
                        <div className="row">
                            <div className="col-12 text-center ">
                                <h1 class="shop-text">TOP FEATURED</h1>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="row justify-content-around">
                            {TOPFEATURED.map(cardItem)}
                        </div>
                    </div>
                </div>
                )
}

                export default Product
