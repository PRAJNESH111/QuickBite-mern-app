const nodemailer = require("nodemailer");

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send order confirmation email
 * @param {string} email - Recipient email address
 * @param {object} orderData - Order data object with order_date, order_data array
 */
async function sendOrderMail(email, orderData) {
  try {
    // Validate inputs
    if (!email || !orderData) {
      throw new Error("Email and orderData are required");
    }

    // Build items table rows
    const itemsRows = orderData.order_data
      .map(
        (item) =>
          `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${item.name}</strong>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.size}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.qty}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          ₹${(item.price * item.qty).toFixed(2)}
        </td>
      </tr>
    `
      )
      .join("");

    // Calculate total
    const total = orderData.order_data.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    // HTML email template
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9; }
    .header { background: linear-gradient(135deg, #cb202d 0%, #d93a3a 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 20px; background: white; }
    .order-info { background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 15px 0; }
    .order-info p { margin: 8px 0; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #cb202d; color: white; padding: 12px; text-align: left; }
    td { padding: 10px; }
    .total-row { font-weight: bold; font-size: 18px; color: #cb202d; text-align: right; padding-top: 15px; border-top: 2px solid #cb202d; }
    .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
    .cta-button { display: inline-block; background: #cb202d; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Order Confirmation</h1>
    </div>
    <div class="content">
      <p>Hi there,</p>
      <p>Thank you for ordering from <strong>GoFood</strong>! Your order has been confirmed and is being prepared.</p>

      <div class="order-info">
        <p><strong>Order Date:</strong> ${new Date(
          orderData.order_date
        ).toLocaleDateString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}</p>
        <p><strong>Order Time:</strong> ${new Date(
          orderData.order_date
        ).toLocaleTimeString("en-IN")}</p>
      </div>

      <h3 style="color: #cb202d; margin-top: 20px;">Order Items:</h3>
      <table>
        <thead>
          <tr>
            <th>Item Name</th>
            <th style="text-align: center;">Size</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <div class="total-row">
        Total Amount: ₹${total.toFixed(2)}
      </div>

      <p style="margin-top: 20px; color: #666;">
        Your order will be delivered soon. You can track your order in the GoFood app.
      </p>

      <div style="text-align: center;">
        <p style="color: #999; font-size: 14px;">If you have any questions, reply to this email or contact our support team.</p>
      </div>
    </div>

    <div class="footer">
      <p>© 2025 GoFood. All rights reserved.</p>
      <p>This is an automated email. Please do not reply with sensitive information.</p>
    </div>
  </div>
</body>
</html>
    `;

    // Plain text version
    const textContent = `
Hi there,

Thank you for ordering from GoFood!

Order Date: ${new Date(orderData.order_date).toLocaleDateString("en-IN")}

Items:
${orderData.order_data
  .map(
    (item, idx) =>
      `${idx + 1}. ${item.name} — Size: ${item.size} — Qty: ${
        item.qty
      } — Price: ₹${(item.price * item.qty).toFixed(2)}`
  )
  .join("\n")}

Total Amount: ₹${total.toFixed(2)}

Your order will be delivered soon! 🚀

Thank you for choosing GoFood!
    `;

    // Send email
    const mailOptions = {
      from: `GoFood Orders <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Order Confirmation – GoFood 🍕",
      text: textContent,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Order confirmation email sent to ${email}:`, info.response);
    return true;
  } catch (error) {
    console.error(
      `❌ Failed to send order confirmation email to ${email}:`,
      error.message
    );
    return false;
  }
}

module.exports = { sendOrderMail };
