import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function ManageFood() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const initialForm = {
    _id: null,
    name: "",
    CategoryName: "",
    img: "",
    description: "",
    isVeg: true,
    rating: 4.0,
    isAvailable: true,
    priceHalf: "",
    priceFull: "",
    priceRegular: "",
    priceMedium: "",
    priceLarge: ""
  };
  
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchFood();
  }, []);

  const fetchFood = async () => {
    try {
      setLoading(true);
      const data = await api.adminGetFood();
      if (data.success) {
        setFoods(data.foods);
      }
    } catch (err) {
      alert("Failed to fetch food items");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (food) => {
    const options = food.options[0] || {};
    setFormData({
      _id: food._id,
      name: food.name,
      CategoryName: food.CategoryName,
      img: food.img,
      description: food.description || "",
      isVeg: food.isVeg,
      rating: food.rating || 4.0,
      isAvailable: food.isAvailable,
      // Map existing options to form fields (handling common sizes)
      priceHalf: options.half || options.Half || "",
      priceFull: options.full || options.Full || "",
      priceRegular: options.regular || options.Regular || "",
      priceMedium: options.medium || options.Medium || "",
      priceLarge: options.large || options.Large || ""
    });
    setShowModal(true);
  };

  const handleCreateNew = () => {
    setFormData(initialForm);
    setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This cannot be undone.`)) {
      try {
        const res = await api.adminDeleteFood(id);
        if (res.success) {
          setFoods(foods.filter(f => f._id !== id));
        } else {
          alert(res.error || "Failed to delete");
        }
      } catch (err) {
        alert("Server error while deleting");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Reconstruct the options object based on provided prices
      const options = {};
      if (formData.priceHalf) options.half = formData.priceHalf.toString();
      if (formData.priceFull) options.full = formData.priceFull.toString();
      if (formData.priceRegular) options.regular = formData.priceRegular.toString();
      if (formData.priceMedium) options.medium = formData.priceMedium.toString();
      if (formData.priceLarge) options.large = formData.priceLarge.toString();
      
      // If no options provided, set a default
      if (Object.keys(options).length === 0) {
        options.regular = "100";
      }

      const payload = {
        name: formData.name,
        CategoryName: formData.CategoryName,
        img: formData.img,
        description: formData.description,
        isVeg: formData.isVeg,
        rating: Number(formData.rating),
        isAvailable: formData.isAvailable,
        options: [options]
      };

      let res;
      if (formData._id) {
        res = await api.adminUpdateFood(formData._id, payload);
      } else {
        res = await api.adminAddFood(payload);
      }

      if (res.success) {
        setShowModal(false);
        fetchFood(); // Refresh list to get accurate data
      } else {
        alert(res.error || "Failed to save item");
      }
    } catch (err) {
      alert("Server error while saving");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Manage Food Items</h2>
        <button className="btn-primary" onClick={handleCreateNew}>
          + Add New Item
        </button>
      </div>

      <div className="admin-table-container">
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center" }}><div className="spinner" style={{ margin: "0 auto" }}></div></div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>Image</th>
                <th>Details</th>
                <th>Category</th>
                <th>Pricing Options</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {foods.map(food => (
                <tr key={food._id}>
                  <td>
                    <img src={food.img} alt={food.name} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }} />
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
                      {food.isVeg ? <span className="badge badge-veg"></span> : <span className="badge badge-nonveg"></span>}
                      {food.name}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-3)", marginTop: "4px", maxWidth: "250px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {food.description || "No description"}
                    </div>
                  </td>
                  <td>
                    <span className="category-pill" style={{ padding: "4px 12px", fontSize: "0.8rem", pointerEvents: "none" }}>
                      {food.CategoryName}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {Object.entries(food.options[0] || {}).map(([key, val]) => (
                        <span key={key} style={{ fontSize: "0.8rem", background: "var(--surface-2)", padding: "2px 6px", borderRadius: "4px", border: "1px solid var(--surface-3)" }}>
                          {key}: ₹{val}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    {food.isAvailable ? (
                      <span className="badge badge-success">Available</span>
                    ) : (
                      <span className="badge badge-error">Out of Stock</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button className="btn-icon" onClick={() => handleEdit(food)} title="Edit">✏️</button>
                      <button className="btn-icon" onClick={() => handleDelete(food._id, food.name)} title="Delete" style={{ color: "var(--error)" }}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Full Screen Modal replacement for Add/Edit Form */}
      {showModal && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: "800px" }}>
            <div className="modal-header">
              <h3 className="modal-title">{formData._id ? "Edit Food Item" : "Add New Food Item"}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-body">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div className="input-group" style={{ margin: 0 }}>
                  <label className="input-label">Item Name *</label>
                  <input type="text" className="input-field" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                
                <div className="input-group" style={{ margin: 0 }}>
                  <label className="input-label">Category *</label>
                  <input type="text" className="input-field" name="CategoryName" value={formData.CategoryName} onChange={handleChange} required placeholder="e.g. Pizza, Starter" />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Image URL *</label>
                <input type="url" className="input-field" name="img" value={formData.img} onChange={handleChange} required placeholder="https://images.unsplash.com/..." />
                {formData.img && (
                  <div style={{ marginTop: "10px" }}>
                    <img src={formData.img} alt="Preview" style={{ height: "100px", borderRadius: "8px", objectFit: "cover" }} onError={(e) => e.target.style.display='none'} />
                  </div>
                )}
              </div>

              <div className="input-group">
                <label className="input-label">Description</label>
                <textarea className="input-field" name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Brief description of the dish..." />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "30px", background: "var(--surface-2)", padding: "16px", borderRadius: "var(--radius-md)" }}>
                <div>
                  <label className="input-label d-flex align-items-center gap-2">
                    <input type="checkbox" name="isVeg" checked={formData.isVeg} onChange={handleChange} style={{ width: "18px", height: "18px" }} />
                    Is Vegetarian?
                  </label>
                </div>
                <div>
                  <label className="input-label d-flex align-items-center gap-2">
                    <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} style={{ width: "18px", height: "18px" }} />
                    Currently Available?
                  </label>
                </div>
                <div className="input-group" style={{ margin: 0 }}>
                  <label className="input-label">Rating (0-5)</label>
                  <input type="number" className="input-field" name="rating" value={formData.rating} onChange={handleChange} min="0" max="5" step="0.1" style={{ padding: "8px 12px" }} />
                </div>
              </div>

              <h4 style={{ fontSize: "1.1rem", marginBottom: "16px", borderBottom: "1px solid var(--surface-3)", paddingBottom: "8px" }}>Pricing Options (Enter at least one)</h4>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div className="input-group" style={{ margin: 0 }}>
                  <label className="input-label">Regular Price</label>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ padding: "0 12px", background: "var(--surface-3)", border: "2px solid var(--surface-3)", borderRight: "none", borderRadius: "8px 0 0 8px", height: "48px", display: "flex", alignItems: "center", fontWeight: 700 }}>₹</span>
                    <input type="number" className="input-field" name="priceRegular" value={formData.priceRegular} onChange={handleChange} style={{ borderRadius: "0 8px 8px 0" }} />
                  </div>
                </div>

                <div className="input-group" style={{ margin: 0 }}>
                  <label className="input-label">Half Price</label>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ padding: "0 12px", background: "var(--surface-3)", border: "2px solid var(--surface-3)", borderRight: "none", borderRadius: "8px 0 0 8px", height: "48px", display: "flex", alignItems: "center", fontWeight: 700 }}>₹</span>
                    <input type="number" className="input-field" name="priceHalf" value={formData.priceHalf} onChange={handleChange} style={{ borderRadius: "0 8px 8px 0" }} />
                  </div>
                </div>

                <div className="input-group" style={{ margin: 0 }}>
                  <label className="input-label">Full Price</label>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ padding: "0 12px", background: "var(--surface-3)", border: "2px solid var(--surface-3)", borderRight: "none", borderRadius: "8px 0 0 8px", height: "48px", display: "flex", alignItems: "center", fontWeight: 700 }}>₹</span>
                    <input type="number" className="input-field" name="priceFull" value={formData.priceFull} onChange={handleChange} style={{ borderRadius: "0 8px 8px 0" }} />
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "32px", borderTop: "1px solid var(--surface-3)", paddingTop: "20px" }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} disabled={saving}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? <div className="spinner spinner-sm"></div> : "Save Food Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
