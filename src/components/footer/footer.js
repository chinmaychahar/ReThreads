import React from 'react';
import './footer.css';

function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-left">
          <h3>Contact Us</h3>
          <ul>
            <li>Email: rethreadsfashions.in</li>
            <li>Phone: +91-234-567-8901</li>
            
          </ul>
        </div>
        <div className="footer-center">
          <h3>Terms and Conditions</h3>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Return And Refund</a></li>
            <li><a href="#">Terms of Use</a></li>
            
          </ul>
        </div>
        <div className="footer-right">
          <h3>Connect With Us</h3>
          <ul>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">LinkedIn</a></li>
            <li><a href="#">Instagram</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
