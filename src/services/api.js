const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const getHeaders = (auth = false) => {
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  if (auth) {
    const token = localStorage.getItem("token");
    if (token) headers["auth-token"] = token;
  }
  return headers;
};

const api = {
  // Food data
  async fetchFoodData() {
    const res = await fetch(`${API_URL}/api/foodData`, { method: "POST", headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch food data");
    return res.json();
  },

  // Auth
  async login(email, password) {
    const res = await fetch(`${API_URL}/api/login`, {
      method: "POST", headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async signup(data) {
    const res = await fetch(`${API_URL}/api/createuser`, {
      method: "POST", headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getUser() {
    const res = await fetch(`${API_URL}/api/getuser`, { method: "POST", headers: getHeaders(true) });
    if (!res.ok) throw new Error("Failed to get user");
    return res.json();
  },

  async updateProfile(data) {
    const res = await fetch(`${API_URL}/api/profile`, {
      method: "PUT", headers: getHeaders(true),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Orders
  async placeOrder(orderData) {
    const res = await fetch(`${API_URL}/api/orderData`, {
      method: "POST", headers: getHeaders(true),
      body: JSON.stringify(orderData),
    });
    return res.json();
  },

  async getMyOrders() {
    const res = await fetch(`${API_URL}/api/myOrderData`, {
      method: "POST", headers: getHeaders(true),
    });
    return res.json();
  },

  // Admin
  async adminDashboard() {
    const res = await fetch(`${API_URL}/api/admin/dashboard`, { headers: getHeaders(true) });
    if (!res.ok) throw new Error("Failed to fetch dashboard");
    return res.json();
  },

  async adminGetOrders(status = "all", page = 1) {
    const params = new URLSearchParams({ status, page, limit: 20 });
    const res = await fetch(`${API_URL}/api/admin/orders?${params}`, { headers: getHeaders(true) });
    if (!res.ok) throw new Error("Failed to fetch orders");
    return res.json();
  },

  async adminUpdateOrderStatus(orderId, status) {
    const res = await fetch(`${API_URL}/api/admin/order/${orderId}/status`, {
      method: "PUT", headers: getHeaders(true),
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  async adminGetFood() {
    const res = await fetch(`${API_URL}/api/admin/food`, { headers: getHeaders(true) });
    if (!res.ok) throw new Error("Failed to fetch food");
    return res.json();
  },

  async adminAddFood(data) {
    const res = await fetch(`${API_URL}/api/admin/food`, {
      method: "POST", headers: getHeaders(true),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async adminUpdateFood(id, data) {
    const res = await fetch(`${API_URL}/api/admin/food/${id}`, {
      method: "PUT", headers: getHeaders(true),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async adminDeleteFood(id) {
    const res = await fetch(`${API_URL}/api/admin/food/${id}`, {
      method: "DELETE", headers: getHeaders(true),
    });
    return res.json();
  },

  async adminGetUsers() {
    const res = await fetch(`${API_URL}/api/admin/users`, { headers: getHeaders(true) });
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
  },
};

export default api;
