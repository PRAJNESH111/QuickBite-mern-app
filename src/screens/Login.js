import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const json = await api.login(credentials.email, credentials.password);
      if (json.success) {
        login(json.authToken, json.userName, json.userRole, json.userEmail || credentials.email);
        navigate(json.userRole === "admin" ? "/admin" : "/");
      } else {
        setError(json.error || "Invalid credentials");
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
      {/* Simple header for auth pages */}
      <div style={{ position: "absolute", top: 20, left: 24, zIndex: 10 }}>
        <Link to="/" style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--primary)" }}>
          🍔 QuickBite
        </Link>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Log in to order your favorite food</p>

          {error && (
            <div className="badge badge-error" style={{ width: "100%", padding: "12px", marginBottom: "20px", fontSize: "0.9rem", display: "block" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label className="input-label">Password</label>
              </div>
              <input
                type="password"
                className="input-field"
                name="password"
                value={credentials.password}
                onChange={onChange}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "10px", height: "48px" }} disabled={loading}>
              {loading ? <div className="spinner spinner-sm"></div> : "Login"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "32px", fontSize: "0.95rem" }}>
            <span style={{ color: "var(--text-3)" }}>Don't have an account? </span>
            <Link to="/signup" style={{ color: "var(--primary)", fontWeight: 600 }}>Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
