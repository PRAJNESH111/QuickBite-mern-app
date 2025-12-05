import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config";
import { Eye, EyeOff } from "lucide-react";
export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });
      const json = await response.json();
      if (json.success) {
        // Save the auth token to local storage and redirect
        localStorage.setItem("userEmail", credentials.email);
        localStorage.setItem("token", json.authToken);

        navigate("/");
      } else {
        alert("Enter Valid Credentials");
      }
    } catch (error) {
      alert("An error occurred during login. Please try again");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #320404 0%, #cb202d 45%, #f43157 100%)",
        color: "#fff",
      }}
    >
      <div className="pb-3">
        <Navbar />
      </div>
      <div className="container-fluid px-2 px-sm-3 pt-4">
        <form
          className="mx-auto mt-5 shadow-soft"
          onSubmit={handleSubmit}
          style={{
            backgroundColor: "rgba(255,255,255,0.95)",
            borderRadius: "24px",
            padding: "1.5rem",
            maxWidth: "500px",
            width: "100%",
          }}
        >
          <h3 className="text-center text-danger mb-4 fw-bold">Login</h3>
          <div className="mb-3">
            <label
              htmlFor="exampleInputEmail1"
              className="form-label text-dark"
            >
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={credentials.email}
              onChange={onChange}
              aria-describedby="emailHelp"
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone.
            </div>
          </div>
          <div className="mb-3">
            <label
              htmlFor="exampleInputPassword1"
              className="form-label text-dark"
            >
              Password
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={credentials.password}
                onChange={onChange}
                name="password"
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="d-grid gap-2 mb-3">
            <button type="submit" className="btn-zomato">
              Login
            </button>
          </div>
          <div className="text-center">
            <p className="text-dark mb-0">Don't have an account?</p>
            <Link to="/signup" className="btn btn-outline-danger btn-sm mt-2">
              Create New Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

// , 'Accept': 'application/json',
//         'Access-Control-Allow-Origin': 'http://localhost:3000/login', 'Access-Control-Allow-Credentials': 'true',
//         "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, OPTIONS'
