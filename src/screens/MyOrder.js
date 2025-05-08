import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { API_URL } from '../config';

export default function MyOrder() {
    const [orderData, setorderData] = useState({})
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchMyOrder = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const userEmail = localStorage.getItem('userEmail');
            if (!userEmail) {
                throw new Error('User email not found. Please log in.');
            }

            console.log('Making request to:', `${API_URL}/api/myOrderData`);
            console.log('With email:', userEmail);
            
            const response = await fetch(`${API_URL}/api/myOrderData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: userEmail
                })
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const data = await response.json();
            console.log('Order Data:', data);
            setorderData(data);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMyOrder();
    }, []);

    return (
        <div>
            <div>
                <Navbar />
            </div>

            <div className='container'>
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
                
                {!loading && !error && Object.keys(orderData).length === 0 && (
                    <div className="alert alert-info mt-3" role="alert">
                        No orders found.
                    </div>
                )}
                
                <div className='row'>
                    {orderData !== 0 ? Array(orderData).map(data => {
                        return (
                            data.orderData ?
                                data.orderData.order_data.slice(0).reverse().map((item) => {
                                    return (
                                        item.map((arrayData) => {
                                            return (
                                                <div key={arrayData._id || Math.random()}>
                                                    {arrayData.Order_date ? <div className='m-auto mt-5'>
                                                        {data = arrayData.Order_date}
                                                        <hr />
                                                    </div> :
                                                        <div className='col-12 col-md-6 col-lg-3'>
                                                            <div className="card mt-3" style={{ width: "16rem", maxHeight: "360px" }}>
                                                                <div className="card-body">
                                                                    <h5 className="card-title">{arrayData.name}</h5>
                                                                    <div className='container w-100 p-0' style={{ height: "38px" }}>
                                                                        <span className='m-1'>{arrayData.qty}</span>
                                                                        <span className='m-1'>{arrayData.size}</span>
                                                                        <span className='m-1'>{data}</span>
                                                                        <div className=' d-inline ms-2 h-100 w-20 fs-5'>
                                                                            ₹{arrayData.price}/-
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            )
                                        })
                                    )
                                }) : ""
                        )
                    }) : ""}
                </div>
            </div>

            <Footer />
        </div>
    )
}
