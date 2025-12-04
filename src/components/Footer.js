import React from "react";

export default function Footer() {
  return (
    <div className="container">
      <footer
        className="d-flex flex-wrap justify-content-between align-items-center py-4 my-4"
        style={{
          background:
            "linear-gradient(120deg, rgba(203,32,45,0.12), rgba(244,49,87,0.2))",
          borderRadius: "24px",
          padding: "1.5rem 2rem",
        }}
      >
        <div className="col-md-6">
          <h5 className="fw-bold text-danger mb-1">QuickBite</h5>
          <span className="text-muted">
            © 2025 inspired by Zomato aesthetics
          </span>
        </div>

        <div className="d-flex gap-2">
          <span className="badge-zomato px-3 py-2">Delivery</span>
          <span className="badge-zomato px-3 py-2">Dining</span>
          <span className="badge-zomato px-3 py-2">Nightlife</span>
        </div>
      </footer>
    </div>
  );
}
