import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Homepage from './page'
import Myhome from './myhome/page'
import Profile from './profile/page'
import Categories from './categories/page'
import Favorites from './favorites/page'
import Login from './auth/login'
import Signup from './auth/signup'
import RecipePage from './recipe/page'
import SearchResults from '../components/SearchResults'
import CategoryDetailPage from './categories/CategoryDetail'
import NotFound from '../NotFound'

const Layout = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/myhome" element={<Myhome />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<Signup />} />
      <Route path="/categories/:categoryType" element={<CategoryDetailPage />} />
      <Route path="/recipe/:id" element={<RecipePage />} />
      <Route path="/search-results" element={<SearchResults />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default Layout
