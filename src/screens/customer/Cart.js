import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { useCart, useDispatchCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function Cart() {
  const cart = useCart();
  const dispatch = useDispatchCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.placeOrder({
        order_data: cart,
        order_date: new Date().toISOString()
      });

      if (response.success) {
        dispatch({ type: "DROP" });
        // Optional: show toast here
        navigate("/myorders", { state: { message: "Order placed successfully!" } });
      } else {
        alert(response.error || "Failed to place order");
      }
    } catch (error) {
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const incrementQty = (index) => {
    dispatch({ type: "INCREMENT", index });
  };

  const decrementQty = (index) => {
    dispatch({ type: "DECREMENT", index });
  };

  const removeItem = (index) => {
    dispatch({ type: "REMOVE", index });
  };

  return (
    <div className="page-container">
      <Navbar />
      
      <div className="page-content" style={{ maxWidth: "1000px" }}>
        <h2 className="section-title mb-4">Your Cart {cart.length > 0 && `(${cart.length} items)`}</h2>
        
        {cart.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <h3 className="empty-state-title">Your cart is empty</h3>
            <p className="empty-state-text">Explore our menu and add some delicious items.</p>
            <Link to="/menu" className="btn-primary" style={{ marginTop: "16px" }}>Browse Menu</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "32px" }}>
            {/* Cart Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {cart.map((item, index) => (
                <div key={index} className="card" style={{ display: "flex", padding: "16px", gap: "16px", alignItems: "center" }}>
                  <img 
                    src={item.img || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format"} 
                    alt={item.name} 
                    style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "12px" }} 
                  />
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "4px" }}>{item.name}</h3>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-3)", marginBottom: "8px" }}>
                      Size: {item.size} • Unit: ₹{item.price / item.qty}
                    </div>
                    <div style={{ fontWeight: 800, color: "var(--primary)" }}>₹{item.price}</div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px" }}>
                    <button 
                      className="btn-icon" 
                      style={{ width: "32px", height: "32px", color: "var(--error)" }}
                      onClick={() => removeItem(index)}
                    >
                      🗑️
                    </button>
                    
                    <div className="cart-quantity-controls">
                      <button className="qty-btn" onClick={() => decrementQty(index)}>-</button>
                      <span style={{ fontWeight: 700, minWidth: "20px", textAlign: "center" }}>{item.qty}</span>
                      <button className="qty-btn" onClick={() => incrementQty(index)}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Checkout Sidebar */}
            <div className="card" style={{ padding: "24px", height: "fit-content", position: "sticky", top: "100px" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "20px", borderBottom: "1px solid var(--surface-3)", paddingBottom: "12px" }}>
                Order Summary
              </h3>
              
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "var(--text-2)" }}>
                <span>Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "var(--text-2)" }}>
                <span>Delivery Fee</span>
                <span>₹40</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", color: "var(--text-2)" }}>
                <span>Taxes & Charges</span>
                <span>₹{(totalPrice * 0.05).toFixed(0)}</span>
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px", fontWeight: 800, fontSize: "1.2rem", borderTop: "1px solid var(--surface-3)", paddingTop: "16px" }}>
                <span>Total to pay</span>
                <span>₹{totalPrice + 40 + Math.round(totalPrice * 0.05)}</span>
              </div>

              <button 
                className="btn-primary" 
                style={{ width: "100%", padding: "14px" }}
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? <div className="spinner spinner-sm"></div> : "Place Order (COD)"}
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
