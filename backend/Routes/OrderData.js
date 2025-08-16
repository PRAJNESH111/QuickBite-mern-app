const express = require('express');
const Order = require('../models/Orders');
const router = express.Router();
const { sendOrderConfirmationEmail } = require('../config/emailConfig');

router.post('/orderData', async (req, res) => {
    try {
        const { order_data, email, order_date } = req.body;

        console.log('Received order request:', {
            email,
            orderDate: order_date,
            itemsCount: order_data.length
        });

        const orderArr = [{ Order_date: order_date }, ...order_data];

        const orderDetails = {
            orderId: Date.now().toString(),
            totalAmount: order_data.reduce((total, item) => total + (item.price * item.qty), 0),
            items: order_data.map(item => ({
                name: item.name,
                quantity: item.qty,
                price: item.price
            }))
        };

        const emailSent = await sendOrderConfirmationEmail(email, orderDetails);

        if (!emailSent) {
            console.error('Failed to send order confirmation email to:', email);
        } else {
            console.log('Order confirmation email sent to:', email);
        }

        // ✅ Save to DB using Mongoose model
        let existingOrder = await Order.findOne({ email });

        if (!existingOrder) {
            await Order.create({
                email,
                orders: [orderArr]
            });
        } else {
            existingOrder.orders.push(orderArr);
            await existingOrder.save();
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error in orderData route:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

router.post('/myOrderData', async (req, res) => {
    try {
        const userOrders = await Order.findOne({ email: req.body.email });
        let orders = userOrders?.orders;
        if (!orders && userOrders?.order_data) {
            orders = userOrders.order_data;
        }
        if (!orders) {
            return res.status(200).json({ orderData: { orders: [] } });
        }
        res.json({ orderData: { orders } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
