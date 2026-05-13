import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <div className="footer-brand">
            <span style={{ fontSize: "1.5rem", marginRight: "8px" }}>🍔</span>
            QuickBite
          </div>
          <p className="footer-text">
            Your favorite food, delivered fast to your door. Experience premium dining from the comfort of your home.
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <span className="badge badge-primary">Delivery</span>
            <span className="badge badge-success">Dining</span>
            <span className="badge badge-warning">Takeaway</span>
          </div>
        </div>

        <div>
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Full Menu</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="footer-title">Categories</h3>
          <ul className="footer-links">
            <li><Link to="/menu?category=Pizza">Pizza</Link></li>
            <li><Link to="/menu?category=Burger">Burgers</Link></li>
            <li><Link to="/menu?category=Chinese">Chinese</Link></li>
            <li><Link to="/menu?category=North%20Indian">North Indian</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="footer-title">Contact Us</h3>
          <p className="footer-text">
            Email: support@quickbite.com<br/>
            Phone: +1 234 567 8900<br/>
            Address: 123 Food Street, Tasty City
          </p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div>© 2025 QuickBite. All rights reserved.</div>
        <div style={{ display: "flex", gap: "20px" }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
