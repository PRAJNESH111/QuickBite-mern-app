import React from "react";
import "../styles/shimmer.css";

export default function ShimmerCard() {
  return (
    <div className="card shimmer-card" style={{ cursor: "pointer" }}>
      <div className="shimmer-image"></div>
      <div className="card-body">
        <div className="shimmer-title"></div>
        <div className="shimmer-text" style={{ marginTop: "8px" }}></div>
        <div
          className="shimmer-text"
          style={{ marginTop: "8px", width: "60%" }}
        ></div>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="shimmer-text" style={{ width: "40%" }}></div>
          <div className="shimmer-text" style={{ width: "30%" }}></div>
        </div>
      </div>
    </div>
  );
}

export function ShimmerOrderCard() {
  return (
    <div
      className="card mb-4 shimmer-card"
      style={{ maxWidth: "700px", margin: "0 auto" }}
    >
      <div className="card-header shimmer-header"></div>
      <div className="card-body">
        <div className="shimmer-text" style={{ marginBottom: "12px" }}></div>
        <div
          className="shimmer-text"
          style={{ marginBottom: "12px", width: "80%" }}
        ></div>
        <div
          className="shimmer-text"
          style={{ marginBottom: "12px", width: "70%" }}
        ></div>
        <div
          className="shimmer-text"
          style={{ marginTop: "20px", width: "60%" }}
        ></div>
      </div>
    </div>
  );
}
