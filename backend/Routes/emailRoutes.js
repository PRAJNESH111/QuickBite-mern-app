const express = require('express');
const router = express.Router();
const { sendOrderConfirmationEmail } = require('../config/emailConfig');

// Route to send order confirmation email
router.post('/send-order-confirmation', async (req, res) => {
    try {
        const { userEmail, orderDetails } = req.body;
        
        if (!userEmail || !orderDetails) {
            return res.status(400).json({ message: 'Email and order details are required' });
        }

        const emailSent = await sendOrderConfirmationEmail(userEmail, orderDetails);
        
        if (emailSent) {
            res.status(200).json({ message: 'Order confirmation email sent successfully' });
        } else {
            res.status(500).json({ message: 'Failed to send order confirmation email' });
        }
    } catch (error) {
        console.error('Error in send-order-confirmation route:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router; 