import React from 'react'
import './PopularCategory.css'

// Map category names to local image paths
const categoryImages = {
  Italian: require('../assets/images/categories/italian.jpg'),
  Thai: require('../assets/images/categories/thai.jpg'),
  Breakfast: require('../assets/images/categories/breakfast.jpg'),
  Desserts: require('../assets/images/categories/desserts.jpg')
}

const PopularCategory = ({ categories }) => {
  return (
    <div className="popular-category-container">
      <h2 className="mb-4">Popular Categories</h2>
      <div className="category-list">
        {categories.map((category, index) => (
          <div key={category.name} className="category-item ms-2">
            {/* Check if the category has an image */}
            {categoryImages[category.name] ? (
              <img
                src={categoryImages[category.name]}
                alt={category.name}
                className="category-icon"
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
          </div>
        ))}
      </div>
    </div>
  )
}

export default PopularCategory
