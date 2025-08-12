import React from 'react';
import '../styles/Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a href="/home#">Home</a>
        <a href="/servicePlans">Services</a>
        <a href="/support">Contact</a>
        <a href="/privacyPolicy">Privacy Policy</a>
        <a href="/termsOfService">Terms of Service</a>
      </div>
      <p>&copy; 2024 TelConnect. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
