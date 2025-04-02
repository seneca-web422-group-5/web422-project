import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import AuthProvider from './context/AuthContext'
import Layout from './app/layout'

const App = () => {
  return (
    <AuthProvider>
      <Header />
      <Layout />
      <Footer />
    </AuthProvider>
  )
}

export default App
