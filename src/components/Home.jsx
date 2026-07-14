import React from 'react'
import Product from './Product'
import Category from './Categories'
import GoToTop from './GoToTop'

const Home = () => {
    return (
        <div>
            <div id="carouselExampleIndicators" className="carousel slide m-3" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>
                </div>
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src="/assets/images/home/banner.png" className="d-block w-100" alt="Banner"/>
                    </div>
                    <div className="carousel-item">
                        <img src="/assets/images/1.png" className="d-block w-100" alt="Adaptive Clothing"/>
                    </div>
                    <div className="carousel-item">
                        <img src="/assets/images/2.png" className="d-block w-100" alt="Adaptive Clothing"/>
                    </div>
                    <div className="carousel-item">
                        <img src="/assets/images/3.png" className="d-block w-100" alt="Adaptive Clothing"/>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
            <div className="section-padding">
                <Category/>
            </div>
            <div className="section-padding" style={{background: 'var(--color-bg-subtle)'}}>
                <Product/>
            </div>
            <GoToTop/>
        </div>
    )
}

export default Home
