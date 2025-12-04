import React from "react";
import Delete from "@mui/icons-material/Delete";
import { useCart, useDispatchCart } from "../components/ContextReducer";
import { API_URL } from "../config";

export default function Cart() {
  let data = useCart();
  let dispatch = useDispatchCart();

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
        dispatch({ type: "DROP" });
        alert("Order Placed successfully!");
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
    <div>
      <div className="container m-auto mt-5 table-responsive table-responsive-sm table-responsive-md">
        <table className="table">
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
              <th scope="col"></th>
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
                    className="btn p-0 btn-danger "
                    onClick={() => dispatch({ type: "REMOVE", index: index })}
                  >
                    <Delete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <h1 className="fs-2 text-danger">Total Price: ₹{totalPrice}/-</h1>
        </div>
        <div>
          <button className="btn-zomato mt-3" onClick={handleCheckOut}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
