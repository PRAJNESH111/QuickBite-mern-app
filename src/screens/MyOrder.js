import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { API_URL } from "../config";

const PLACEHOLDER_IMG = "/momos.jpg";

export default function MyOrder() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [foodMap, setFoodMap] = useState({});

  // Fetch all food items and map by ID
  const fetchFoodMap = async () => {
    try {
      const response = await fetch(`${API_URL}/api/foodData`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        const foodItems = data[0] || [];

        // Create a map of foodId -> food item
        const map = {};
        foodItems.forEach((item) => {
          map[item._id] = item;
        });

        setFoodMap(map);
        console.log("Food map created:", map);
      }
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

      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) {
        setError("User email not found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/myOrderData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched order data:", data);

      // Extract orders array from response
      const orderList = data?.orderData?.orders || [];
      setOrders(orderList);

      if (orderList.length === 0) {
        setError("No orders found for this account.");
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
        <h2 className="mb-4 text-center fw-bold">My Orders</h2>

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
