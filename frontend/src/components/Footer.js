import React from 'react';

const Footer = () => (
  <footer style={{ background: '#333', color: 'white', padding: '20px', textAlign: 'center' }}>
    <div>
      <h3>About Us</h3>
      <p>Umesh Store: Quality wear for street, sports, and daily use.</p>
    </div>
    <div>
      <h3>Follow Us</h3>
      <a href="https://instagram.com/umeshstore" style={{ color: 'white' }}>Instagram</a>
    </div>
    <div>
      <h3>Contact</h3>
      <p>Email: support@umeshstore.com</p>
      <p>Phone: +123456789</p>
    </div>
    <p>&copy; 2025 Umesh Store</p>
  </footer>
);

export default Footer;