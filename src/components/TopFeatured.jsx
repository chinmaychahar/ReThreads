import React from 'react'
import { NavLink } from 'react-router-dom';
import DATA from '../Data'
import GoToTop from './GoToTop';

const TopFeatured = () => {

    const cardItem = (item) => {
        return (
            <div class="card my-1 py-4 mb-3" key={item.id} style={{width: "15rem"}}>
                <img src={item.img} class="card-img-top" alt={item.title}/>
                    <div class="card-body text-center">
                        <h5 class="card-title">{item.title}</h5>
                        <p className="lead">{item.price} </p>
                        <NavLink to={`/products/${item.id}`} class="btn btn-outline-warning">Buy Now</NavLink>
                    </div>
                    <GoToTop/>
</div>
                );
    }

                return (
                <div>
                    <div className="container py-5">
                        <div className="row">
                            <div className="col-12 text-center ">
                                <h1>Shop By Category</h1>
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

                export default TopFeatured
