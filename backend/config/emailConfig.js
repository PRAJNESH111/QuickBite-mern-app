// backend/configemail.js
const nodemailer = require("nodemailer");

async function sendOrderConfirmationEmail(email, orderData) {
  try {
    // configure transporter (example with Gmail SMTP)
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    // send mail
    // Build a nice formatted order summary
    const orderSummary = `
🧾 Order ID: ${orderData.orderId}
💰 Total Amount: ₹${orderData.totalAmount}

📦 Items:
${orderData.items
  .map(
    (item, i) =>
      `${i + 1}. ${item.name} x${item.quantity} - ₹${
        item.price * item.quantity
      }`
  )
  .join("\n")}
`;
    console.log(orderSummary);
    // Send email
    await transporter.sendMail({
      from: `"GoFood Orders" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Order Confirmation - GoFood 🍔",
      text: `Thank you for your order!\n\n${orderSummary}`,
    });

    console.log("Email sent successfully to", email);
    return true;
  } catch (error) {
    console.error("Error sending email:", error.message);
    return false;
  }
}

module.exports = { sendOrderConfirmationEmail };
