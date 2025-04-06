import React from 'react'
import { useNavigate } from 'react-router-dom'
import './RecommendByUs.css'

const RecommendByUs = ({ recommendations = [] }) => {
  const navigate = useNavigate()
  const handleRecipeClick = (id) => {
    if (id) {
      navigate(`/recipe/${id}`)
    }
  }

  const handleMoreDetailsClick = (id) => {
    if (id) {
      alert(`More details about recipe ID: ${id}`)
    }
  }

  if (!recommendations.length) {
    return <div>No recommendations available.</div>
  }

  // Helper function to render star ratings
  const renderStars = (score) => {
    const maxStars = 5
    const filledStars = Math.round(score * maxStars) // Convert score (0-1) to stars (0-5)
    return (
      <div className="recommend-card-stars d-flex justify-content-center mb-0">
        {[...Array(maxStars)].map((_, index) => (
          <span key={index} className={index < filledStars ? 'star filled' : 'star'}>
            ★
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="recommend-container">
      <h2 className="mb-4">Recommend by Us</h2>
      <div className="recommend-list">
        {recommendations.map((item) => (
          <div key={item.id} className="recommend-card">
            {/* image */}
            <div className="recommend-card-image" onClick={() => handleRecipeClick(item.id)} style={{ cursor: 'pointer' }}>
              {item.thumbnail_url ? (
                <img src={item.thumbnail_url} alt={item.name} />
              ) : (
                <div className="recommend-card-no-image">No Image</div>
              )}
            </div>
            {/* rating */}
            {item.user_ratings && item.user_ratings.score ? (
              <div>
                {renderStars(item.user_ratings.score)}
                <p className="recommend-card-rating-count mt-0">
                  {item.user_ratings.count_positive} positive ratings
                </p>
              </div>
            ) : (
              <p className="recommend-card-no-rating">No Ratings</p>
            )}
            {/* recipe name */}
            <h3 className="recommend-card-title">{item.name}</h3>
            {/* author */}
            <p className="recommend-card-author">by {item.author}</p>
            {/* tags */}
            <div className="recommend-card-tags">
              {item.tags.length > 0 ? (
                item.tags.slice(0, 5).map((tag, index) => (
                  <span key={`${item.id}-${tag}-${index}`} className="recommend-card-tag">
                    {tag}
                  </span>
                ))
              ) : (
                <span className="recommend-card-tag">No Tags</span>
              )}
            </div>
            {/* info icon */}
            <div
              className="recommend-card-info-icon d-flex justify-content-end"
              onClick={() => handleMoreDetailsClick(item.id)}
              style={{ cursor: 'pointer', marginTop: '10px', textAlign: 'center' }}
            >
              <i className="bi bi-info-circle" style={{ fontSize: '20px', color: '#007bff' }}></i>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecommendByUs
