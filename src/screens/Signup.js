import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Signup() {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", location: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const json = await api.signup(credentials);
      if (json.success) {
        // Redirect to login after successful signup
        navigate("/login", { state: { message: "Account created successfully. Please login." } });
      } else {
        if (json.errors && Array.isArray(json.errors)) {
          setError(json.errors.join(", "));
        } else {
          setError(json.error || "Failed to create account");
        }
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="page-container" style={{ paddingTop: 0 }}>
      <div style={{ position: "absolute", top: 20, left: 24, zIndex: 10 }}>
        <Link to="/" style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--primary)" }}>
          🍔 QuickBite
        </Link>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join us and start ordering today</p>

          {error && (
            <div className="badge badge-error" style={{ width: "100%", padding: "12px", marginBottom: "20px", fontSize: "0.9rem", display: "block" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input
                type="text"
                className="input-field"
                name="name"
                value={credentials.name}
                onChange={onChange}
                placeholder="John Doe"
                required
                minLength={3}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input
                type="email"
                className="input-field"
                name="email"
                value={credentials.email}
                onChange={onChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                type="password"
                className="input-field"
                name="password"
                value={credentials.password}
                onChange={onChange}
                placeholder="Min. 5 characters"
                required
                minLength={5}
              />
            </div>

            <div className="input-group">
              <label className="input-label">City / Delivery Area</label>
              <input
                type="text"
                className="input-field"
                name="location"
                value={credentials.location}
                onChange={onChange}
                placeholder="e.g. New York, NY"
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "10px", height: "48px" }} disabled={loading}>
              {loading ? <div className="spinner spinner-sm"></div> : "Sign Up"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "32px", fontSize: "0.95rem" }}>
            <span style={{ color: "var(--text-3)" }}>Already have an account? </span>
            <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>Login here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
