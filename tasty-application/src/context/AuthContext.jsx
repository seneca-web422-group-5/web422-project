// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // When the provider mounts, check for a token and decode it
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("AuthProvider mounted, decoded token:", decoded);
        setUser(decoded);
      } catch (error) {
        console.error("Token decode failed:", error);
        setUser(null);
      }
    }
  }, []);

  // login function: save token and update user state
  const login = (token) => {
    localStorage.setItem('token', token);
    try {
      const decoded = jwtDecode(token);
      console.log("login() decoded token:", decoded);
      setUser(decoded);
    } catch (error) {
      console.error("Token decode failed in login():", error);
      setUser(null);
    }
  };

  // logout function: remove token and clear user state
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
