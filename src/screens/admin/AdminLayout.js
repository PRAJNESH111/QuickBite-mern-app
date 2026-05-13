import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/admin.css";

export default function AdminLayout({ children }) {
  const { logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: "📊" },
    { name: "Manage Orders", path: "/admin/orders", icon: "📋" },
    { name: "Food Items", path: "/admin/food", icon: "🍔" },
    { name: "Users", path: "/admin/users", icon: "👥" },
  ];

  return (
    <div className="admin-layout">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="modal-overlay" 
          onClick={() => setSidebarOpen(false)}
          style={{ zIndex: 90 }}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-brand">
          <span>🍔</span> QuickBite Admin
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="admin-logout">
          <button 
            className="btn-ghost" 
            style={{ width: "100%", justifyContent: "flex-start", color: "var(--error)" }}
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button className="mobile-toggle" onClick={() => setSidebarOpen(true)}>
              ☰
            </button>
            <h2 style={{ fontSize: "1.25rem", margin: 0, fontWeight: 700 }}>
              {navItems.find(i => i.path === location.pathname)?.name || "Dashboard"}
            </h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link to="/" className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>👁️</span> View Site
            </Link>
          </div>
        </header>

        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}
