import emailjs from '@emailjs/browser';

// Initialize EmailJS
emailjs.init({
    publicKey: "QFWpt1bTxL1DHMgxa",
    limitRate: true
});

export const sendOrderConfirmationEmail = async (userEmail, orderDetails) => {
    try {
        const templateParams = {
            to_email: userEmail,
            order_id: orderDetails.orderId,
            total_amount: orderDetails.totalAmount,
            items: orderDetails.items.map(item => 
                `${item.name} - Quantity: ${item.quantity} - Price: ₹${item.price}`
            ).join('\n'),
            from_name: 'GoFood'
        };

        await emailjs.send(
            'service_om3dvrn',
            'template_37hqqsv',
            templateParams
        );
        return true;
    } catch (error) {
        return false;
    }
};

export const sendLoginConfirmationEmail = async () => {
    
}; 