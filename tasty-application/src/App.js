// src/App.js
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Layout from './app/layout';
import { DataCacheProvider } from './context/DataCacheContext';

const App = () => {
  return (
    <AuthProvider>
      <DataCacheProvider>
        <Header />
        <Layout />
        <Footer />
      </DataCacheProvider>
    </AuthProvider>
  );
};

export default App;
