import React from 'react'
import { NavLink } from 'react-router-dom';
import ALDATA from '../AlzhiemerShop';
import GoToTop from './GoToTop';

const Clothes = () => {

    const cardItem = (item) => {
        return (
            <div class="card my-1 py-4 mb-5" key={item.id} style={{width: "15rem"}}>
                <img src={item.img} class="card-img-top" alt={item.title}/>
                    <div class="card-body text-center">
                        <h5 class="card-title">{item.title}</h5>
                        <p className="lead">{item.price} INR</p>
                        <div onClick={scrollToTop} >
                        <NavLink to={`/allProducts/${item.id}`} class="btn btn-outline-warning">Buy Now</NavLink>
                        </div>
                    </div>
</div>
                );
    }
                return (
                <div>
                    <div className="container mt-3 mb-0 py-5">
                        <div className="row">
                            <div className="col-12 text-center " style={{color: 'grey'}}>
                                <h2>The Alzheimer's Adaptive Store</h2>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="row justify-content-around">
                            {ALDATA.map(cardItem)}
                        </div>
                    </div>
                    <GoToTop/>
                </div>
                )
}

const scrollToTop = () => {
    window.scrollTo(0, 0)
}

export default Clothes
