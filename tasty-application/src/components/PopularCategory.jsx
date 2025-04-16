import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/PopularCategory.css'

const PopularCategory = ({ categories }) => {
  return (
    <div className="popular-category-container">
      <h2 className="mb-4">Popular Categories</h2>
      <div className="category-list">
        {categories.map((category) => (
          <Link
            key={category.name}
            to={`/categories/${category.name}`}
            className="category-item ms-2"
          >
            {category.image ? (
              <img
                src={category.image}
                alt={category.name}
                className="category-icon"
                loading="lazy"
              />
            ) : (
              <div
                className="category-icon fallback"
                style={{
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  width: '80px',
                  height: '80px'
                }}
              >
                <p style={{ color: '#333', fontSize: '12px', textAlign: 'center' }}>
                  {category.name}
                </p>
              </div>
            )}
            <p className="category-name">{category.name}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default PopularCategory
