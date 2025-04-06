import React from 'react'
import './RecommendByUs.css'

const RecommendByUs = ({ recommendations = [] }) => {
  if (!recommendations.length) {
    return <div>No recommendations available.</div>
  }

  // Helper function to render star ratings
  const renderStars = (score) => {
    const maxStars = 5
    const filledStars = Math.round(score * maxStars) // Convert score (0-1) to stars (0-5)
    return (
      <div className="recommend-card-stars d-flex justify-content-center">
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
      <h2 className="recommend-title">Recommend by Us</h2>
      <div className="recommend-list">
        {recommendations.map((item) => (
          <div key={item.id} className="recommend-card">
            <div className="recommend-card-image">
              {item.thumbnail_url ? (
                <img src={item.thumbnail_url} alt={item.name} />
              ) : (
                <div className="recommend-card-no-image">No Image</div>
              )}
            </div>
            <h3 className="recommend-card-title">{item.name}</h3>
            <p className="recommend-card-author">{item.author}</p>
            {item.user_ratings && item.user_ratings.score ? (
              <div>
                {renderStars(item.user_ratings.score)}
                <p className="recommend-card-rating-count">
                  {item.user_ratings.count_positive} positive ratings
                </p>
              </div>
            ) : (
              <p className="recommend-card-no-rating">No Ratings</p>
            )}
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
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecommendByUs
