import React from 'react';
import Delete from '@mui/icons-material/Delete';
import { useCart, useDispatchCart } from '../components/ContextReducer';
import { API_URL } from '../config';

export default function Cart() {
  let data = useCart();
  let dispatch = useDispatchCart();

  if (data.length === 0) {
    return (
      <div className='m-5 w-100 text-center fs-3'>The Cart is Empty!</div>
    );
  }

  const handleCheckOut = async () => {
    try {
      let userEmail = localStorage.getItem("userEmail");
      
      if (!userEmail) {
        alert("User email not found. Please log in.");
        console.error("User email not found. Please log in.");
        return; 
      }

      console.log('Making request to:', `${API_URL}/api/orderData`);
      
      let response = await fetch(`${API_URL}/api/orderData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          order_data: data,
          email: userEmail,
          order_date: new Date().toDateString()
        })
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        dispatch({ type: "DROP" }); 
        alert("Order Placed successfully!");
      } else {
        const errorText = await response.text();
        console.error(`Checkout failed with status: ${response.status} - ${errorText}`);
        alert("Checkout failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Error during checkout. Please try again.");
    }
  };

  let totalPrice = data.reduce((total, food) => total + food.price * food.qty, 0);

  return (
    <div>
      <div className='container m-auto mt-5 table-responsive table-responsive-sm table-responsive-md' >
        <table className='table'>
          <thead className='text-success fs-4'>
            <tr>
              <th scope='col'>#</th>
              <th scope='col'>Name</th>
              <th scope='col'>Quantity</th>
              <th scope='col'>Option</th>
              <th scope='col'>Amount</th>
              <th scope='col'></th>
            </tr>
          </thead>
          <tbody className='text-white fs-5 '>
            {data.map((food, index) => (
              <tr key={index}>
                <th scope='row'>{index + 1}</th>
                <td>{food.name}</td>
                <td>{food.qty}</td>
                <td>{food.size}</td>
                <td>{food.price * food.qty}</td>
                <td>
                  <button type="button" className="btn p-0 btn-danger " onClick={() => dispatch({ type: "REMOVE", index: index })}>
                    <Delete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <h1 className='fs-2 text-white'>Total Price: ₹{totalPrice}/-</h1>
        </div>
        <div>
          <button className='btn bg-success mt-5' onClick={handleCheckOut}>Place Order</button>
        </div>
      </div>
    </div>
  );
}
