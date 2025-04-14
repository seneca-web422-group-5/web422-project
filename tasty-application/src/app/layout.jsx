// src/app/layout.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from './page';
import Myhome from './myhome/page';
import Profile from './profile/page';
import Categories from './categories/page';
import Favorites from './favorites/page';
import Login from '../components/Login';  // ensure path correctness
import Signup from './auth/signup';
import RecipePage from './recipe/page';
import SearchResults from '../components/SearchResults';
import CategoryDetailPage from './categories/CategoryDetail';
import NotFound from '../NotFound';
import TestDatabase from '../components/TestDatabaseClient';
import ProtectedRoute from '../components/ProtectedRoute';

const Layout = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route 
        path="/myhome" 
        element={<ProtectedRoute><Myhome /></ProtectedRoute>} 
      />
      <Route 
        path="/profile" 
        element={<ProtectedRoute><Profile /></ProtectedRoute>} 
      />
      <Route 
        path="/favorites" 
        element={<ProtectedRoute><Favorites /></ProtectedRoute>} 
      />
      <Route path="/categories" element={<Categories />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<Signup />} />
      <Route path="/categories/:categoryType" element={<CategoryDetailPage />} />
      <Route path="/recipe/:id" element={<RecipePage />} />
      <Route path="/search-results" element={<SearchResults />} />
      <Route path="/test-db" element={<TestDatabase />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Layout;
