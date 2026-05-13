import React, { useState, useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import api from "../../services/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    address: { street: "", city: "", state: "", pincode: "" }
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await api.getUser();
      setUser(data);
      setFormData({
        name: data.name || "",
        phone: data.phone || "",
        location: data.location || "",
        address: data.address || { street: "", city: "", state: "", pincode: "" }
      });
    } catch (err) {
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const parts = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parts[0]]: {
          ...prev[parts[0]],
          [parts[1]]: value
        }
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const result = await api.updateProfile(formData);
      if (result.success) {
        setSuccess("Profile updated successfully!");
        setUser(result.user);
      } else {
        setError(result.error || "Failed to update profile");
      }
    } catch (err) {
      setError("Server error while updating profile");
    } finally {
      setSaving(false);
      
      // Clear success message after 3s
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  return (
    <div className="page-container">
      <Navbar />
      
      <div className="page-content" style={{ maxWidth: "800px" }}>
        <h2 className="section-title mb-4">My Profile</h2>
        
        {loading ? (
          <div className="card shimmer" style={{ height: "400px" }}></div>
        ) : (
          <div className="card" style={{ padding: "32px", position: "relative", overflow: "visible" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "32px", paddingBottom: "24px", borderBottom: "1px solid var(--surface-3)" }}>
              <div style={{ 
                width: "80px", height: "80px", borderRadius: "50%", 
                background: "var(--primary-gradient)", color: "white",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "2.5rem", fontWeight: 700 
              }}>
                {user?.name?.charAt(0) || "U"}
              </div>
              <div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>{user?.email}</h3>
                <div style={{ display: "inline-block", padding: "4px 12px", background: "var(--surface-2)", borderRadius: "var(--radius-full)", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-2)", marginTop: "8px" }}>
                  {user?.role === "admin" ? "Admin User" : "Customer"}
                </div>
              </div>
            </div>

            {error && <div className="badge badge-error" style={{ width: "100%", padding: "12px", marginBottom: "24px", fontSize: "0.95rem" }}>{error}</div>}
            {success && <div className="badge badge-success" style={{ width: "100%", padding: "12px", marginBottom: "24px", fontSize: "0.95rem" }}>{success}</div>}

            <form onSubmit={handleSubmit}>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "16px" }}>Personal details</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "32px" }}>
                <div className="input-group" style={{ margin: 0 }}>
                  <label className="input-label">Full Name</label>
                  <input type="text" className="input-field" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="input-group" style={{ margin: 0 }}>
                  <label className="input-label">Phone Number</label>
                  <input type="tel" className="input-field" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 xxxxx xxxxx" />
                </div>
              </div>

              <h4 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "16px" }}>Delivery Address</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "32px" }}>
                <div className="input-group" style={{ margin: 0 }}>
                  <label className="input-label">Street Address / Building Name</label>
                  <input type="text" className="input-field" name="address.street" value={formData.address?.street} onChange={handleInputChange} placeholder="Flat 402, Block B..." />
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
                  <div className="input-group" style={{ margin: 0 }}>
                    <label className="input-label">City</label>
                    <input type="text" className="input-field" name="address.city" value={formData.address?.city} onChange={handleInputChange} />
                  </div>
                  <div className="input-group" style={{ margin: 0 }}>
                    <label className="input-label">State</label>
                    <input type="text" className="input-field" name="address.state" value={formData.address?.state} onChange={handleInputChange} />
                  </div>
                  <div className="input-group" style={{ margin: 0 }}>
                    <label className="input-label">PIN Code</label>
                    <input type="text" className="input-field" name="address.pincode" value={formData.address?.pincode} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="input-group" style={{ margin: 0 }}>
                  <label className="input-label">Delivery Note / General Location (Optional)</label>
                  <input type="text" className="input-field" name="location" value={formData.location} onChange={handleInputChange} placeholder="Leave at the door, landmark, etc." />
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
