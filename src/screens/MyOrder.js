import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { API_URL } from "../config";
import apiService from "../services/apiService";

const PLACEHOLDER_IMG = "/momos.jpg";

export default function MyOrder() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [foodMap, setFoodMap] = useState({});

  // Fetch all food items and map by ID (with caching)
  const fetchFoodMap = async () => {
    try {
      const data = await apiService.fetchFoodData();
      const foodItems = data[0] || [];

      // Create a map of foodId -> food item
      const map = {};
      foodItems.forEach((item) => {
        map[item._id] = item;
      });

      setFoodMap(map);
      console.log("Food map created:", map);
    } catch (err) {
      console.error("Failed to fetch food map:", err);
    }
  };

  // Get actual food image or fallback
  const getFoodImage = (foodId, itemName) => {
    if (foodMap[foodId]?.img) {
      return foodMap[foodId].img;
    }

    // Fallback: guess by name
    const name = itemName.toLowerCase();
    if (name.includes("biryani") || name.includes("rice")) return "/momos.jpg";
    if (name.includes("pizza")) return "/pizza.jpg";
    if (name.includes("burger")) return "/burger.jpg";
    return PLACEHOLDER_IMG;
  };

  const fetchMyOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      const url = `${API_URL}/api/myOrderData`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "auth-token": token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      const orderList = data?.orderData?.orders || [];

      setOrders(orderList);

      if (orderList.length === 0) {
        setError(
          "No orders found for this account. Place an order to get started!"
        );
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodMap();
    fetchMyOrder();
  }, []);

  // Debug: Log orders state whenever it changes
  useEffect(() => {
    console.log("📊 Orders state updated:", orders);
  }, [orders]);

  // Add refresh button handler
  const handleRefresh = () => {
    console.log("🔄 Refreshing orders...");
    fetchFoodMap();
    fetchMyOrder();
  };

  const renderOrderCards = () => {
    if (!orders.length) return null;

    return orders.map((order, idx) => {
      const orderDate = order.orderDate
        ? new Date(order.orderDate).toLocaleDateString("en-IN", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "Unknown Date";

      const items = order.items || [];
      const total = order.totalAmount || 0;

      return (
        <div
          className="card mb-4 order-card w-100"
          key={order._id || idx}
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            backgroundColor: "#fff",
          }}
        >
          <div
            className="card-header text-white d-flex justify-content-between align-items-center"
            style={{
              background:
                "linear-gradient(120deg, rgba(203,32,45,0.9), rgba(244,49,87,0.9))",
            }}
          >
            <span>
              Order Date: <b>{orderDate}</b>
            </span>
            <span className="badge-zomato">Delivered</span>
          </div>
          <div className="card-body">
            {items.length > 0 ? (
              items.map((item, i) => (
                <div
                  className="d-flex align-items-center mb-3 pb-3 border-bottom"
                  key={i}
                >
                  <img
                    src={getFoodImage(item.foodId, item.name)}
                    alt={item.name}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      background: "#eee",
                      marginRight: 20,
                    }}
                    onError={(e) => {
                      e.target.src = PLACEHOLDER_IMG;
                    }}
                  />
                  <div className="flex-grow-1">
                    <div className="fw-bold fs-5 mb-1">{item.name}</div>
                    <div>
                      <span className="badge bg-secondary me-2">
                        Qty: {item.qty}
                      </span>
                      {item.size && (
                        <span className="badge bg-light text-dark me-2">
                          Size: {item.size}
                        </span>
                      )}
                      <span className="badge bg-success">
                        ₹{(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted">
                No items in this order
              </div>
            )}
            <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
              <span className="fw-bold">Total</span>
              <span className="fs-5 text-danger fw-bold">
                ₹{total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div>
      <Navbar />

      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">My Orders</h2>
          <button
            className="btn btn-outline-danger"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? "Loading..." : "🔄 Refresh"}
          </button>
        </div>

        {/* DEBUG INFO - Remove later */}
        <div
          style={{
            fontSize: "0.75rem",
            color: "#666",
            marginBottom: "1rem",
            padding: "0.5rem",
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
          }}
        >
          <strong>Debug Info:</strong>
          <br />
          Loading: {loading ? "Yes" : "No"}
          <br />
          Error: {error ? error : "None"}
          <br />
          Orders Count: {orders.length}
          <br />
          Orders State: {JSON.stringify(orders.slice(0, 1))}
        </div>

        {loading && (
          <div className="alert alert-info mt-3" role="alert">
            Loading orders...
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="alert alert-info mt-3" role="alert">
            No orders found.
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="d-flex flex-column gap-3">{renderOrderCards()}</div>
        )}
      </div>

      <Footer />
    </div>
  );
}
