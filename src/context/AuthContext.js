import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Migrate old localStorage key from original app
  const migrateOldToken = () => {
    const oldToken = localStorage.getItem("authToken");
    if (oldToken && !localStorage.getItem("token")) {
      localStorage.setItem("token", oldToken);
      localStorage.removeItem("authToken");
    }
    return localStorage.getItem("token") || null;
  };

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(migrateOldToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const userName = localStorage.getItem("userName");
      const userRole = localStorage.getItem("userRole");
      const userEmail = localStorage.getItem("userEmail");
      setUser({ name: userName, role: userRole, email: userEmail });
    }
    setLoading(false);
  }, [token]);

  const login = (authToken, userName, userRole, userEmail) => {
    localStorage.setItem("token", authToken);
    localStorage.setItem("userName", userName);
    localStorage.setItem("userRole", userRole);
    localStorage.setItem("userEmail", userEmail);
    setToken(authToken);
    setUser({ name: userName, role: userRole, email: userEmail });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    setToken(null);
    setUser(null);
  };

  const isAdmin = () => user?.role === "admin";
  const isLoggedIn = () => !!token;

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
