import React from 'react'
import { NavLink } from 'react-router-dom'
import ReactPlayer from 'react-player'

const About = () => {

    const VIDEO_PATH = '../assets/ReThreads-Video.mp4';

    return (
        <div>
            <div className="container py-5 my-5">
                <div className=" row">
                <h1 className="head-text text-warning fw-bold mx-auto">Discover ReThreads</h1>
                <div align="center" className='media-box'>
                    <ReactPlayer url={VIDEO_PATH} controls={true} />
                </div>
                <div class
                Name=" d-flex justify-content-center"></div>
                    <div className="mt-5">
                        
                        <p className="first-p about-text lead">
                        Welcome to Rethereads dedicated to providing adaptive clothing made from old, used clothes donated by people to help those in need. We understand the importance of clothing and the role it plays in our daily lives. For some, finding comfortable and affordable clothing can be a challenge, especially for individuals with disabilities or special needs.
        </p>
        <p className="about-text lead">

Our mission is to address this challenge by repurposing donated clothing items into adaptive clothing that meets the unique needs of individuals with physical and cognitive disabilities. By using old clothes, we not only help the environment but also reduce the cost of clothing for those who need it the most.
</p>
<p className="about-text lead">

Our team of skilled and dedicated volunteers works tirelessly to transform these clothes into functional and fashionable adaptive clothing that meets the needs of our customers. We take pride in providing our customers with high-quality clothing that fits their unique body shapes and styles, ensuring they feel comfortable and confident.
</p>
<p className="about-text lead">

We believe that everyone should have access to comfortable and functional clothing, regardless of their physical abilities or financial situations. We hope that our website will serve as a resource for those in need of adaptive clothing, and we invite you to join us in making a positive impact on the lives of others.

                        </p>
                        <div class="text-center">
                        <NavLink to="/contact" className="about-btn btn btn-outline-warning px-3">Contact ReThreads</NavLink>
                        </div>
                        </div>
                </div>
            </div>
        </div>
    )
}

export default About
