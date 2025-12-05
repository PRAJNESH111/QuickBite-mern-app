# Order Debugging Guide

## Steps to Debug Why Orders Are Not Displaying

### 1. Check Backend Database

Open your browser and go to:

```
http://localhost:5000/api/debug/allOrders
```

This will show:

- Total number of orders in database
- Total number of users
- All orders with their details

### 2. Check Orders for Specific Email

```
http://localhost:5000/api/debug/ordersForEmail/your-email@example.com
```

Replace `your-email@example.com` with your actual email

### 3. Check Frontend Console

1. Open DevTools (F12)
2. Go to Console tab
3. Go to My Orders page
4. Look for logs with emojis:
   - 🔑 Token status
   - 🌐 API call status
   - ✅ Data received
   - 📦 Order count

### 4. Check Backend Console

Look for logs like:

- 🔍 /myOrderData route called
- 👤 User ID: [ID]
- ✅ User found: [email]
- 📦 Retrieved X orders

### 5. If No Orders Exist

Place a test order:

1. Add items to cart
2. Click "Place Order"
3. Check for success message
4. Check backend console for confirmation

### 6. Verify Order Was Saved

After placing an order, run step 1 again to see if a new order appears in the database.

## Common Issues

| Issue           | Solution                                                      |
| --------------- | ------------------------------------------------------------- |
| Token missing   | Make sure you're logged in                                    |
| User not found  | Check if user email exists in database                        |
| No orders in DB | Place a test order first                                      |
| Wrong email     | Verify the email used during signup matches the one in orders |
| Cache issue     | Clear browser cache or use Ctrl+Shift+Delete                  |
