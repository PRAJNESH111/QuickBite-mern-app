import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.adminGetUsers();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Manage Users</h2>
        <button className="btn-secondary" onClick={fetchUsers} disabled={loading}>↻ Refresh</button>
      </div>

      <div className="admin-table-container">
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center" }}><div className="spinner" style={{ margin: "0 auto" }}></div></div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role</th>
                <th>Location / Phone</th>
                <th>Orders Total</th>
                <th>Total Spent</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>
                    <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--primary-glow)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      {user.name}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-3)", marginTop: "4px" }}>{user.email}</div>
                  </td>
                  <td>
                    <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-info'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-2)" }}>{user.location || "Not provided"}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-3)" }}>{user.phone || "No phone"}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{user.orderCount || 0}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: "var(--success)" }}>₹{user.totalSpent?.toLocaleString() || 0}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-2)" }}>{new Date(user.createdAt).toLocaleDateString()}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
