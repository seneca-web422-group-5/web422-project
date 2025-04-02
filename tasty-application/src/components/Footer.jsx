import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-light py-3 mt-auto">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        {/* Logo and Copyright */}
        <div className="d-flex align-items-center mb-3 mb-md-0">
          <i className="bi bi-play-circle me-2"></i>
          <span>Tasty © 2025 All rights reserved.</span>
        </div>

        {/* Social Media Icons */}
        <div className="d-flex">
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dark me-3"
          >
            <i className="bi bi-youtube"></i>
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dark me-3"
          >
            <i className="bi bi-facebook"></i>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dark me-3"
          >
            <i className="bi bi-twitter"></i>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dark me-3"
          >
            <i className="bi bi-instagram"></i>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dark"
          >
            <i className="bi bi-linkedin"></i>
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
