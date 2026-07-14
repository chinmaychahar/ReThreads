import React from 'react'
import { NavLink } from 'react-router-dom';
import DATA from './Data'

const Category = () => {
    return (
        <div className="container">
            <h2 className="section-title">Shop by Category</h2>
            <div className="product-grid">
                {DATA.map((item) => (
                    <NavLink to={`/category/${item.slug}`} key={item.id} style={{textDecoration: 'none'}}>
                        <div className="card h-100">
                            <img src={item.img} className="card-img-top" alt={item.title}/>
                            <div className="card-body text-center">
                                <h5 className="card-title">{item.title}</h5>
                            </div>
                        </div>
                    </NavLink>
                ))}
            </div>
        </div>
    )
}

export default Category
