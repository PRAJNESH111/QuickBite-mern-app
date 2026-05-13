import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await api.adminDashboard();
      if (data.success) {
        setStats(data.stats);
        setRecentOrders(data.recentOrders || []);
      }
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">💰</div>
          <div className="stat-info">
            <h3>Total Revenue</h3>
            <p>₹{stats?.totalRevenue?.toLocaleString() || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">📦</div>
          <div className="stat-info">
            <h3>Total Orders</h3>
            <p>{stats?.totalOrders || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">👥</div>
          <div className="stat-info">
            <h3>Customers</h3>
            <p>{stats?.totalUsers || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon info">🍔</div>
          <div className="stat-info">
            <h3>Food Items</h3>
            <p>{stats?.totalFood || 0}</p>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px", marginBottom: "32px", background: "white", padding: "24px", borderRadius: "12px", border: "1px solid var(--surface-3)" }}>
        <div style={{ textAlign: "center", borderRight: "1px solid var(--surface-3)" }}>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--warning)" }}>{stats?.pendingOrders || 0}</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-2)", textTransform: "uppercase", fontWeight: 700 }}>Pending</div>
        </div>
        <div style={{ textAlign: "center", borderRight: "1px solid var(--surface-3)" }}>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#9C27B0" }}>{stats?.preparingOrders || 0}</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-2)", textTransform: "uppercase", fontWeight: 700 }}>Preparing</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--success)" }}>{stats?.deliveredOrders || 0}</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-2)", textTransform: "uppercase", fontWeight: 700 }}>Delivered</div>
        </div>
      </div>

      <div className="card" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h3 style={{ fontSize: "1.25rem", margin: 0 }}>Recent Orders</h3>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: "center", padding: "32px" }}>No recent orders</td></tr>
              ) : recentOrders.map(order => (
                <tr key={order._id}>
                  <td style={{ fontFamily: "monospace" }}>{order._id.substring(order._id.length - 8).toUpperCase()}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{order.user?.name || "Unknown"}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-3)" }}>{order.email}</div>
                  </td>
                  <td>{new Date(order.orderDate).toLocaleString()}</td>
                  <td style={{ fontWeight: 700 }}>₹{order.totalAmount}</td>
                  <td>
                    <span className={`badge ${
                      order.status === 'delivered' ? 'badge-success' : 
                      order.status === 'cancelled' ? 'badge-error' : 
                      order.status === 'pending' ? 'badge-warning' : 'badge-info'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
