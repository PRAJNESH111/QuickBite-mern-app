import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import "./App.css";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Customer Screens
import Home from "./screens/customer/Home";
import Cart from "./screens/customer/Cart";
import MyOrder from "./screens/customer/MyOrder";
import Profile from "./screens/customer/Profile";
import Login from "./screens/Login";
import Signup from "./screens/Signup";

// Admin Screens + Layout
import AdminLayout from "./screens/admin/AdminLayout";
import Dashboard from "./screens/admin/Dashboard";
import ManageOrders from "./screens/admin/ManageOrders";
import ManageFood from "./screens/admin/ManageFood";
import ManageUsers from "./screens/admin/ManageUsers";

// Admin page wrappers
const AdminDashboard = () => <AdminLayout><Dashboard /></AdminLayout>;
const AdminOrders   = () => <AdminLayout><ManageOrders /></AdminLayout>;
const AdminFood     = () => <AdminLayout><ManageFood /></AdminLayout>;
const AdminUsers    = () => <AdminLayout><ManageUsers /></AdminLayout>;

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Customer Routes */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/myorders" element={<ProtectedRoute><MyOrder /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Admin Protected Routes */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>} />
            <Route path="/admin/food" element={<ProtectedRoute adminOnly><AdminFood /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
