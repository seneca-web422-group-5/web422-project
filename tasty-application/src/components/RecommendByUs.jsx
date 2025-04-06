import React from 'react'
import './RecommendByUs.css'

const RecommendByUs = ({ recommendations = [] }) => {
  if (!recommendations.length) {
    return <div>No recommendations available.</div>
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
            <p className="recommend-card-author">{item.author || 'Unknown Author'}</p>
            <div className="recommend-card-tags">
              {item.tags && item.tags.length > 0 ? (
                item.tags.map((tag, index) => (
                  <span key={`${tag}-${index}`} className="recommend-card-tag">
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
