import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div
      className="not-found-page d-flex flex-column justify-content-center align-items-center"
      style={{
        height: '100vh',
        backgroundColor: '#F9F9F9',
        color: '#7F7F7F',
        textAlign: 'center',
        padding: '20px'
      }}
    >
      <h1 style={{ fontSize: '6rem', color: '#FF642F', fontFamily: 'Playfair Display, serif' }}>
        404
      </h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '20px', fontFamily: 'Inter, sans-serif' }}>
        Page Not Found
      </h2>
      <p style={{ fontSize: '1.2rem', marginBottom: '30px', fontFamily: 'Inter, sans-serif' }}>
        Oops! The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="btn btn-primary"
        style={{
          fontSize: '1.2rem',
          backgroundColor: '#FF642F',
          borderColor: '#FF642F',
          padding: '10px 20px',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        Go Back to Homepage
      </Link>
    </div>
  )
}

export default NotFound
