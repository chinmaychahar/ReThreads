import React from 'react'
import GoToTop from './GoToTop'

const Contact = () => {
    return (
        <div>
            <div className="container mb-5">
                <div className="row">
                    <div className="col-12 text-center py-4 my-4">
                        <h1 className="con-head">Get in Touch</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md 5 d-flex justify-content-center">
                        <img src="/assets/images/about.jpeg" alt="Contact Us" height="300px" width="500px" />
                    </div>
                    <div className="col-md-6">
                        <form >
                            <div class="mb-3">
                                <label for="exampleForm" class="form-label">Full Name</label>
                                <input type="text" class="form-control" id="exampleForm" placeholder="Your name.."/>
</div>
                            <div class="mb-3">
                                <label for="exampleFormControlInput1" class="form-label">Email address</label>
                                <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="Your email id.."/>
</div>
                                <div class="mb-3">
                                    <label for="exampleFormControlTextarea1" class="form-label">Drop your thoughts below!</label>
                                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="5" placeholder="We would love to have you as a volunteer/donater.."></textarea>
                                </div>
                                <button type="submit" class="btn btn-outline-warning">Send Message</button>
                        </form>
                    </div>
                    </div>
                </div>
                <GoToTop/>
            </div>
            )
}

            export default Contact
