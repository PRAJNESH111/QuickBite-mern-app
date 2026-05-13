import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const { user, isLoggedIn, logout, isAdmin } = useAuth();
  const cart = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const cartCount = cart.reduce((total, item) => total + item.qty, 0);

  // Don't show public navbar on admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span style={{ fontSize: "1.8rem" }}>🍔</span>
          QuickBite
        </Link>

        <div className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/menu" className={`nav-link ${location.pathname === '/menu' ? 'active' : ''}`}>Menu</Link>
          <Link to="/myorders" className={`nav-link ${location.pathname === '/myorders' ? 'active' : ''}`}>My Orders</Link>
        </div>

        <div className="nav-actions">
          <Link to="/cart" className="cart-btn">
            <span>🛒 Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {!isLoggedIn() ? (
            <>
              <Link to="/login" className="btn-ghost">Login</Link>
              <Link to="/signup" className="btn-primary">Sign Up</Link>
            </>
          ) : (
            <div className="user-menu" ref={dropdownRef} style={{ position: 'relative' }}>
              <button 
                className="user-menu-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {user?.name?.charAt(0) || "U"}
              </button>

              {showDropdown && (
                <div className="user-dropdown">
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--surface-3)', background: 'var(--surface-2)' }}>
                    <div style={{ fontWeight: 600 }}>{user?.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>{user?.email}</div>
                  </div>
                  
                  {isAdmin() ? (
                    <Link to="/admin" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                      ⚙️ Admin Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                        👤 Profile
                      </Link>
                      <Link to="/myorders" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                        📦 Orders
                      </Link>
                    </>
                  )}
                  
                  <button onClick={handleLogout} className="dropdown-item" style={{ color: 'var(--error)' }}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
