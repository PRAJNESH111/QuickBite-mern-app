import React from "react";
import { Link } from "react-router-dom";

export default function HeroBanner() {
  return (
    <div className="hero">
      <img 
        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" 
        alt="Delicious Food" 
        className="hero-img"
      />
      <div className="hero-overlay">
        <h1 className="hero-title">Discover the best food & drinks in your city</h1>
        <p className="hero-subtitle">Fast delivery • Fresh food • Excellent service</p>
        <Link to="/menu" className="btn-primary" style={{ width: "fit-content", padding: "14px 36px", fontSize: "1.1rem" }}>
          Explore Menu
        </Link>
      </div>
    </div>
  );
}
