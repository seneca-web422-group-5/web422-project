import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On mount, check for token in localStorage and decode it if valid.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check token expiration (decoded.exp is in seconds)
        if (decoded.exp * 1000 < Date.now()) {
          // Token is expired – remove it and set user to null.
          localStorage.removeItem('token');
          setUser(null);
        } else {
          // Token is valid – set user state.
          setUser(decoded);
        }
      } catch (error) {
        // If token fails to decode, remove it.
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  }, []);

  // When login occurs, store the token and update the user state.
  const login = (token) => {
    localStorage.setItem('token', token);
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (error) {
      setUser(null);
    }
  };

  // Clear token and reset user state on logout.
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
