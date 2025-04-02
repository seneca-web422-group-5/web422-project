import React, { createContext, useState } from 'react'

// Create the AuthContext
export const AuthContext = createContext()

// Placeholder AuthProvider
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null) // Simulate user state

  const login = (userData) => setUser(userData) // Simulate login
  const logout = () => setUser(null) // Simulate logout

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export default AuthProvider
