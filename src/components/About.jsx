import React from 'react'
import { NavLink } from 'react-router-dom'
import ReactPlayer from 'react-player'
import GoToTop from './GoToTop'
import Avatar from 'react-avatar';

const About = () => {
    return (
        <div>
            <div className="container py-5 my-5">
                <div className="row">
                    <div className="col-md-6">
                <h1 className="head-text text-warning fw-bold mx-auto">Our Mission</h1>
<p className="first-p about-text lead"> We are Rethereads, dedicated to providing adaptive clothing made from old, used clothes donated by people to help those in need. </p>
<p className="about-text lead"> Our team of skilled and dedicated volunteers works tirelessly to transform these clothes into functional and fashionable adaptive clothing that meets the needs of our customers. We take pride in providing our customers with high-quality clothing that fits their unique body shapes and styles, ensuring they feel comfortable and confident. </p>
<p className="about-text lead"> We believe that everyone should have access to comfortable and functional clothing, regardless of their physical abilities or financial situations. We hope that our website will serve as a resource for those in need of adaptive clothing, and we invite you to join us in making a positive impact on the lives of others. </p>            
                      <div align='center'>
                        <NavLink to="/contact" className="about-btn btn btn-outline-warning px-3">Contact ReThreads</NavLink>
                      </div>
                    </div>
<div className="col-md-6 d-flex justify-content-center">
        <div className='media-box'>
                <ReactPlayer className='player' url='https://www.youtube.com/watch?v=kr1XlZzlxlw' controls={true} width='100%' height='100%'/>
        </div>
    </div>
    </div>
    </div>
    <div>
    <div className="container py-5 my-5">
    <h1 className="head-text text-warning fw-bold mx-auto">Our First Customer</h1>

                <div className="row">
                <div className="col-md-5">
                <div className='avatar'>
                <Avatar size="200" src='./assets/Capture.PNG' round={true} />
                </div>
                </div>
                <div className="col-md-6">
                <p className="testimonial-text lead"> Meet Shreya, she's our special first customer and has been battling Cerebral Palsy since her birth. Shreya needs her mom's asistance in getting dressed everyday and we just wanted to lend a small helping hand to make the process easier for both of them. Her mom gave us permission to redesign adaptive clothes that fit her needs.</p> 
                <p className="testimonial-text lead"> "The design is convenient and reduces the hassle of wearing cloth for my daughter by a lot. The velcro could have been attached more firmly and without leaving gaps but otherwise, with a proper stich and finishing, I'd defintely invest in buying such afforadable adaptive clothes for my daughter." - Her mom  </p>
                </div>
        </div>
        </div>
    </div>
    <GoToTop/>
    </div>
    )
}

export default About