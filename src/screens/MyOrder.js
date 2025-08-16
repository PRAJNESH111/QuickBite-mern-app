import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { API_URL } from "../config";

const PLACEHOLDER_IMG = "/placeholder.png";

export default function MyOrder() {
  const [orderData, setorderData] = useState({});
  const [error, setError] = useState("No Order Found in this Account ");
  const [loading, setLoading] = useState(true);

  const fetchMyOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) {
        throw new Error("User email not found. Please log in.");
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
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Fetched order data:", data);
      setorderData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrder();
  }, []);

  const renderOrderCards = () => {
    const orders =
      orderData?.orderData?.orders || orderData?.orderData?.order_data || [];
    if (!orders.length) return null;

    console.log("Rendering orders:", orders);

    return orders
      .filter(
        (orderArr) =>
          Array.isArray(orderArr) &&
          orderArr.length > 0 &&
          typeof orderArr[0] === "object" &&
          orderArr[0] !== null &&
          typeof orderArr[0].Order_date === "string" &&
          orderArr[0].Order_date.trim() !== ""
      )
      .slice()
      .reverse()
      .map((orderArr, idx) => {
        const orderDate = orderArr[0].Order_date || "Unknown Date";
        const total = orderArr.reduce(
          (sum, item) => sum + (item.price || 0),
          0
        );

        return (
          <div
            className="card mb-4 shadow-lg border-0 rounded-4 w-100"
            key={orderDate + idx}
            style={{ maxWidth: "700px", margin: "0 auto" }}
          >
            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center rounded-top-4">
              <span>
                Order Date: <b>{orderDate}</b>
              </span>
              <span className="badge bg-primary">Delivered</span>
            </div>
            <div className="card-body">
              {orderArr.slice(1).map((item, i) => (
                <div
                  className="d-flex align-items-center mb-3 pb-3 border-bottom"
                  key={i}
                >
                  <img
                    src={
                      item.img && item.img.trim() !== ""
                        ? item.img
                        : PLACEHOLDER_IMG
                    }
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
                      e.target.onerror = null;
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
                      <span className="badge bg-success">₹{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                <span className="fw-bold">Total</span>
                <span className="fs-5 text-success fw-bold">₹{total}</span>
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

        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            Error loading orders: {error}
          </div>
        )}

        {!loading &&
          !error &&
          !(
            (orderData?.orderData?.orders &&
              orderData.orderData.orders.length) ||
            (orderData?.orderData?.order_data &&
              orderData.orderData.order_data.length)
          ) && (
            <div className="alert alert-info mt-3" role="alert">
              No orders found.
            </div>
          )}

        <div className="d-flex flex-column gap-3">{renderOrderCards()}</div>
      </div>

      <Footer />
    </div>
  );
}
