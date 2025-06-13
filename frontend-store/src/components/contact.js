import React from 'react';
import './style.css';

const Contact = () => { 
  return (
    <div className="page-container">
      <h2>Contact Us</h2>
      <div className="contact-info">
        <div className="contact-item">
          <span className="contact-icon">📞</span>
          <p>Phone: +91-8969907941</p>
        </div>
        <div className="contact-item">
          <span className="contact-icon">✉️</span>
          <p>Email: support@movieflex.com</p>
        </div>
        <div className="contact-item">
          <span className="contact-icon">🏢</span>
          <p>Address: OMTP, Bangalore, India</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;