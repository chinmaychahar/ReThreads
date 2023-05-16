import React from 'react'
import { NavLink } from 'react-router-dom';
import DATA from './Data'
import GoToTop from './GoToTop'

const Category = () => {

    const cardItem = (item) => {
        return (
            <div class="my-card card my-1 py-4 mb-3" key={item.id} style={{width: "15rem"}}>
                <img src={item.img} class="card-img-top" alt={item.title}/>
                    <div class="card-body text-center">
                        <h5 class="card-title">{item.title}</h5>
                        <p className="lead">{item.price} </p>
                        <NavLink to={`/Alzheimer`} class="btn btn-outline-warning">Buy Now</NavLink>
                    </div>
                <GoToTop  />
</div>
                );
    }
                return (
                <div>
                    <div className="container py-5">
                        <div className="row">
                            <div className="col-12 text-center ">
                                <h2 class="shop-text">SHOP BY CATEGORY</h2>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="row justify-content-around">
                            {DATA.map(cardItem)}
                        </div>
                    </div>
                </div>
                )
}

export default Category