import React, { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import api from "../../services/api";
import { useLocation } from "react-router-dom";

export default function MyOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getMyOrders();
      if (data.success) {
        setOrders(data.orderData.orders || []);
      } else {
        setError(data.error || "Failed to fetch orders");
      }
    } catch (err) {
      setError("Server error. Could not fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { className: "badge-warning", text: "Pending" },
      confirmed: { className: "badge-info", text: "Confirmed" },
      preparing: { className: "badge-primary", text: "Preparing" },
      out_for_delivery: { className: "badge-info", text: "Out for Delivery" },
      delivered: { className: "badge-success", text: "Delivered" },
      cancelled: { className: "badge-error", text: "Cancelled" },
    };

    const s = statusMap[status] || statusMap.pending;
    return <span className={`badge ${s.className}`}>{s.text}</span>;
  };

  return (
    <div className="page-container">
      <Navbar />

      <div className="page-content" style={{ maxWidth: "900px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div>
            <h2 className="section-title">My Orders</h2>
            <div className="section-divider"></div>
          </div>
          
          <button className="btn-secondary" onClick={fetchOrders} disabled={loading}>
            ↻ Refresh
          </button>
        </div>

        {location.state?.message && (
          <div className="badge badge-success" style={{ width: "100%", padding: "16px", marginBottom: "24px", fontSize: "1rem", display: "block" }}>
            ✓ {location.state.message}
          </div>
        )}

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {[1, 2].map(i => <div key={i} className="card shimmer" style={{ height: "200px" }}></div>)}
          </div>
        ) : error ? (
          <div className="empty-state">
            <h3 className="empty-state-title" style={{ color: "var(--error)" }}>Error</h3>
            <p className="empty-state-text">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3 className="empty-state-title">No orders yet</h3>
            <p className="empty-state-text">You haven't placed any orders. Time to explore our menu!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {orders.map((order) => (
              <div key={order._id} className="card" style={{ padding: "0" }}>
                <div style={{ 
                  padding: "16px 24px", 
                  background: "var(--surface-2)", 
                  borderBottom: "1px solid var(--surface-3)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px"
                }}>
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-3)", marginBottom: "4px" }}>ORDER ID: <span style={{ fontFamily: "monospace" }}>{order._id.substring(order._id.length - 8).toUpperCase()}</span></div>
                    <div style={{ fontWeight: 600 }}>{new Date(order.orderDate).toLocaleString()}</div>
                  </div>
                  <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-3)", marginBottom: "4px" }}>TOTAL</div>
                      <div style={{ fontWeight: 800 }}>₹{order.totalAmount}</div>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                <div style={{ padding: "24px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{
                          width: "32px", height: "32px", borderRadius: "8px", 
                          background: "var(--surface-2)", display: "flex", 
                          alignItems: "center", justifyContent: "center",
                          fontWeight: 700, color: "var(--primary)"
                        }}>
                          {item.qty}x
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600 }}>{item.name}</div>
                          <div style={{ fontSize: "0.85rem", color: "var(--text-3)" }}>{item.size}</div>
                        </div>
                        <div style={{ fontWeight: 600 }}>₹{item.price * item.qty}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--surface-3)", fontSize: "0.9rem", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <span style={{ color: "var(--text-3)" }}>📍 Delivery to:</span>
                    <span style={{ fontWeight: 500 }}>{order.deliveryAddress || "Not specified"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
