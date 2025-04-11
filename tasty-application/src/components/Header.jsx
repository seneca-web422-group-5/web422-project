import React, { useContext } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import SearchBar from './SearchBar'
import '../styles/Header.css'

const Header = () => {
  //   const { user, logout } = useContext(AuthContext)

  // Mock user for testing purposes
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com'
  }
  const logout = () => {
    console.log('User logged out')
  }

  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-play-circle me-2"></i> Tasty
        </Link>

        {/* Navbar Toggler for Small Screens */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Navbar */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Homepage Link */}
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center ${isActive ? 'active' : ''}`
                }
                to="/"
              >
                <i className="bi bi-house-door me-1"></i> Homepage
              </NavLink>
            </li>

            {/* My Home (Visible for Logged-In Users) */}
            {user && (
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link d-flex align-items-center ${isActive ? 'active' : ''}`
                  }
                  to="/myhome"
                >
                  <i className="bi bi-house-heart me-1"></i> My Home
                </NavLink>
              </li>
            )}

            {/* Categories Link */}
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center ${isActive ? 'active' : ''}`
                }
                to="/categories"
              >
                <i className="bi bi-grid me-1"></i> Categories
              </NavLink>
            </li>

            {/* Favourite (Visible for Logged-In Users) */}
            {user && (
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link d-flex align-items-center ${isActive ? 'active' : ''}`
                  }
                  to="/favorites"
                >
                  <i className="bi bi-heart me-1"></i> Favourite
                </NavLink>
              </li>
            )}
          </ul>

          {/* Search Bar */}
          <div className="d-flex align-items-center me-3">
            <SearchBar />
          </div>

          {/* Profile Dropdown */}
          {user ? (
            <div className="dropdown">
              <button
                className="btn btn-light dropdown-toggle d-flex align-items-center"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-person-circle me-1"></i> Profile
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                <li>
                  <Link className="dropdown-item" to="/profile">
                    Profile Page
                  </Link>
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="dropdown">
              <button
                className="btn btn-light dropdown-toggle d-flex align-items-center"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-person-circle me-1"></i> Login
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                <li>
                  <Link className="dropdown-item" to="/auth/login">
                    Login
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/auth/signup">
                    Signup
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Header
