import React from "react";
import Delete from "@mui/icons-material/Delete";
import { useCart, useDispatchCart } from "../components/ContextReducer";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import apiService from "../services/apiService";

export default function Cart() {
  let data = useCart();
  let dispatch = useDispatchCart();
  const navigate = useNavigate();

  if (data.length === 0) {
    return <div className="m-5 w-100 text-center fs-3">The Cart is Empty!</div>;
  }

  const handleCheckOut = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please log in to place an order.");
        console.error("Auth token missing. User must log in.");
        return;
      }

      console.log("Starting checkout process...");
      console.log("Cart data:", data);

      const orderData = {
        order_data: data,
        order_date: new Date().toDateString(),
      };

      console.log("Sending order data:", orderData);

      let response = await fetch(`${API_URL}/api/orderData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "auth-token": token,
        },
        body: JSON.stringify(orderData),
      });

      console.log("Response status:", response.status);
      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (response.ok) {
        console.log("✅ Order successful! Clearing cache and redirecting...");

        // Clear cache so fresh orders are fetched
        apiService.clearCache();
        console.log("🗑️ Cache cleared");

        // Clear cart
        dispatch({ type: "DROP" });

        alert("Order Placed successfully! Redirecting to My Orders...");

        // Wait a moment for database to write, then redirect
        setTimeout(() => {
          navigate("/myorder");
        }, 1500);
      } else {
        console.error(`Checkout failed with status: ${response.status}`);
        console.error("Response data:", responseData);
        alert("Checkout failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Error during checkout. Please try again.");
    }
  };

  let totalPrice = data.reduce((total, food) => total + food.price, 0);

  return (
    <div className="cart-container">
      <div className="container-fluid mt-4 mt-md-5 px-2 px-md-4">
        {/* Desktop/Tablet Table View */}
        <div className="d-none d-lg-block table-responsive">
          <table className="table table-hover">
            <thead
              style={{ backgroundColor: "rgba(203,32,45,0.08)" }}
              className="text-danger fs-5"
            >
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Quantity</th>
                <th scope="col">Option</th>
                <th scope="col">Amount</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody className="fs-5" style={{ color: "#2a1b1b" }}>
              {data.map((food, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{food.name}</td>
                  <td>{food.qty}</td>
                  <td>{food.size}</td>
                  <td>₹{food.price}</td>
                  <td>
                    <button
                      type="button"
                      className="btn p-0 btn-danger"
                      onClick={() => dispatch({ type: "REMOVE", index: index })}
                    >
                      <Delete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="d-lg-none">
          {data.map((food, index) => (
            <div key={index} className="cart-card mb-3">
              <div className="cart-card-header d-flex justify-content-between align-items-center">
                <span className="badge bg-danger fs-6">#{index + 1}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-danger p-1"
                  onClick={() => dispatch({ type: "REMOVE", index: index })}
                >
                  <Delete fontSize="small" />
                </button>
              </div>
              <div className="cart-card-body">
                <div className="cart-item-row">
                  <span className="label">Name:</span>
                  <span className="value">{food.name}</span>
                </div>
                <div className="cart-item-row">
                  <span className="label">Quantity:</span>
                  <span className="value">{food.qty}</span>
                </div>
                <div className="cart-item-row">
                  <span className="label">Option:</span>
                  <span className="value">{food.size}</span>
                </div>
                <div className="cart-item-row">
                  <span className="label">Amount:</span>
                  <span className="value text-danger fw-bold">
                    ₹{food.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total and Checkout */}
        <div className="cart-footer mt-4 mt-md-5">
          <div className="total-section mb-4">
            <h2 className="fs-3 fs-md-2 text-danger fw-bold">
              Total Price: ₹{totalPrice}/-
            </h2>
          </div>
          <div className="checkout-section">
            <button
              className="btn-zomato w-100 w-md-auto"
              onClick={handleCheckOut}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
