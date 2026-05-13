import React, { useEffect, useState, useCallback } from "react";
import api from "../../services/api";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.adminGetOrders(filter, page);
      if (data.success) {
        setOrders(data.orders);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);



  const updateStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      const res = await api.adminUpdateOrderStatus(id, newStatus);
      if (res.success) {
        // Update local state
        setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
      } else {
        alert(res.error || "Failed to update status");
      }
    } catch (err) {
      alert("Error updating order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "preparing", label: "Preparing" },
    { value: "out_for_delivery", label: "Out for Delivery" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" }
  ];

  return (
    <div>
      <div className="card" style={{ padding: "24px", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span style={{ fontWeight: 600, color: "var(--text-2)" }}>Filter Status:</span>
            <select 
              className="select-field" 
              style={{ width: "200px" }}
              value={filter}
              onChange={(e) => { setFilter(e.target.value); setPage(1); }}
            >
              <option value="all">All Orders</option>
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          
          <button className="btn-secondary" onClick={fetchOrders} disabled={loading}>
            ↻ Refresh
          </button>
        </div>
      </div>

      <div className="admin-table-container">
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center" }}><div className="spinner" style={{ margin: "0 auto" }}></div></div>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID & Date</th>
                  <th>Customer Details</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status & Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan="5" className="empty-state">No orders found</td></tr>
                ) : orders.map(order => (
                  <tr key={order._id}>
                    <td>
                      <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "1.1rem" }}>
                        {order._id.substring(order._id.length - 8).toUpperCase()}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-3)", marginTop: "4px" }}>
                        {new Date(order.orderDate).toLocaleString()}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{order.user?.name || "Unknown User"}</div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-2)" }}>{order.email}</div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-3)", marginTop: "4px", maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        📍 {order.deliveryAddress || "No address provided"}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-2)", maxHeight: "60px", overflowY: "auto" }}>
                        {order.items.map((item, i) => (
                          <div key={i}>{item.qty}x {item.name} ({item.size})</div>
                        ))}
                        <div style={{ fontWeight: 600, marginTop: "4px", color: "var(--text)" }}>Total Items: {order.items.reduce((acc, curr) => acc + curr.qty, 0)}</div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 800, color: "var(--primary)", fontSize: "1.1rem" }}>
                      ₹{order.totalAmount}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <select
                          className="select-field"
                          style={{ 
                            padding: "6px 12px", 
                            fontSize: "0.85rem", 
                            minWidth: "140px",
                            borderColor: order.status === 'delivered' ? 'var(--success)' : 
                                       order.status === 'cancelled' ? 'var(--error)' : 'var(--surface-3)'
                          }}
                          value={order.status}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          disabled={updatingId === order._id || order.status === 'delivered' || order.status === 'cancelled'}
                        >
                          {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        {updatingId === order._id && <div className="spinner spinner-sm"></div>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderTop: "1px solid var(--surface-3)" }}>
                <span style={{ fontSize: "0.9rem", color: "var(--text-2)" }}>Page {page} of {totalPages}</span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button className="btn-secondary" style={{ padding: "6px 12px" }} disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
                  <button className="btn-secondary" style={{ padding: "6px 12px" }} disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
