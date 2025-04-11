import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="not-found-page" style={{ textAlign: 'center', padding: '50px' }}>
      <h1 style={{ fontSize: '4rem', color: '#ff6f61' }}>404</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Page Not Found</h2>
      <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
        Oops! The page you are looking for does not exist.
      </p>
      <Link to="/" style={{ fontSize: '1.2rem', color: '#007bff', textDecoration: 'none' }}>
        Go Back to Homepage
      </Link>
    </div>
  )
}

export default NotFound
