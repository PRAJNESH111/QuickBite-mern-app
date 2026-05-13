import React, { useState, useEffect } from "react";
import { useDispatchCart, useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function FoodCard({ item }) {
  const dispatch = useDispatchCart();
  const cart = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("");
  const [imgLoaded, setImgLoaded] = useState(false);

  // Default isAvailable to true if field is missing from DB
  const isAvailable = item.isAvailable !== false;

  // Fallback image if item doesn't have one
  const fallbackImg = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop";

  const options = item.options[0] || {};
  const priceOptions = Object.keys(options);

  // Set default size on mount (depend on item._id, not priceOptions array ref)
  useEffect(() => {
    const opts = Object.keys(item.options?.[0] || {});
    if (opts.length > 0) {
      setSize(opts[0]);
    }
  }, [item._id, item.options]);

  const handleAddToCart = () => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    if (!size) {
      alert("Please select a size");
      return;
    }

    const finalPrice = qty * parseInt(options[size]);

    // Check if it exists in cart with same size
    const existingItem = cart.find(cartItem => cartItem.id === item._id && cartItem.size === size);

    if (existingItem) {
      dispatch({ type: "UPDATE", id: item._id, size: size, price: finalPrice, qty: qty });
    } else {
      dispatch({ 
        type: "ADD", 
        id: item._id, 
        name: item.name, 
        price: finalPrice, 
        qty: qty, 
        size: size, 
        img: item.img || fallbackImg 
      });
    }

    // Optional: add toast notification here
  };

  const finalPrice = size ? qty * parseInt(options[size]) : 0;

  return (
    <div className="card food-card">
      <div className="food-img-container">
        <img 
          src={item.img || fallbackImg} 
          alt={item.name} 
          className="food-img"
          style={{ display: imgLoaded ? "block" : "none" }}
          onLoad={() => setImgLoaded(true)}
          onError={(e) => { e.target.src = fallbackImg; setImgLoaded(true); }}
        />
        {!imgLoaded && <div className="shimmer" style={{ width: "100%", height: "100%" }}></div>}
        
        <div className="food-badges">
          {item.isVeg ? (
            <div className="badge badge-veg" title="Vegetarian"></div>
          ) : (
            <div className="badge badge-nonveg" title="Non-Vegetarian"></div>
          )}
        </div>
        
        <div className={`food-rating ${item.rating >= 4 ? 'high' : 'mid'}`}>
          ⭐ {item.rating || "4.0"}
        </div>
      </div>

      <div className="food-info">
        <h3 className="food-title">
          {item.name}
          {!isAvailable && <span className="badge badge-error" style={{ fontSize: "0.6rem" }}>Out of Stock</span>}
        </h3>
        
        <p className="food-desc">
          {item.description || `Delicious ${item.name} from the ${item.CategoryName} category.`}
        </p>

        <div className="food-controls">
          <div className="food-options">
            <select 
              className="select-field" 
              style={{ padding: "8px 12px", width: "40%" }}
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value))}
              disabled={!isAvailable}
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>

            <select 
              className="select-field" 
              style={{ padding: "8px 12px", width: "60%" }}
              value={size}
              onChange={(e) => setSize(e.target.value)}
              disabled={!isAvailable}
            >
              {priceOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="food-price">₹{finalPrice}</div>
            <button 
              className="btn-primary" 
              style={{ padding: "8px 16px" }}
              onClick={handleAddToCart}
              disabled={!isAvailable}
            >
              Add +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
