import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/RecommendByUs.css'

const RecommendByUs = ({ recommendations = [] }) => {
  const navigate = useNavigate()
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [page, setPage] = useState(1) // track the current page in the modal

  const handleRecipeClick = (id) => {
    if (id) {
      navigate(`/recipe/${id}`)
    }
  }

  const handleMoreDetailsClick = (recipe) => {
    console.log('More details clicked for recipe:', recipe)
    setSelectedRecipe(recipe)
    setShowModal(true)
    setPage(1)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedRecipe(null)
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
            <h3 className="recommend-card-title" onClick={() => handleRecipeClick(item.id)} style={{ cursor: 'pointer' }}>{item.name}</h3>
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
              onClick={() => handleMoreDetailsClick(item)}
              style={{ cursor: 'pointer', marginTop: '10px', textAlign: 'center' }}
            >
              <i className="bi bi-info-circle" style={{ fontSize: '20px', color: '#007bff' }}></i>
            </div>
          </div>
        ))}
      </div>

      {/* Bootstrap Modal */}
      {showModal && selectedRecipe && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header d-flex justify-content-between align-items-center">
                <h5 className="modal-title">{selectedRecipe.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {selectedRecipe.thumbnail_url && (
                  <img
                    src={selectedRecipe.thumbnail_url}
                    alt={selectedRecipe.name}
                    className="img-fluid mb-3"
                    style={{ borderRadius: '8px' }}
                  />
                )}
                {page === 1 && (
                  <>
                    {/* Page 1: Basic Details */}
                    {selectedRecipe.description && (
                      <p>
                        <strong>Description:</strong>
                        <span
                          dangerouslySetInnerHTML={{ __html: selectedRecipe.description }}
                        ></span>
                      </p>
                    )}
                    {selectedRecipe.author && (
                      <p>
                        <strong>Author:</strong> {selectedRecipe.author}
                      </p>
                    )}
                  </>
                )}

                {page === 2 && (
                  <>
                    {/* Page 2: Additional Details */}
                    {selectedRecipe.prep_time_minutes && (
                      <p>
                        <strong>Prep Time:</strong> {selectedRecipe.prep_time_minutes} minutes
                      </p>
                    )}
                    {selectedRecipe.cook_time_minutes && (
                      <p>
                        <strong>Cook Time:</strong> {selectedRecipe.cook_time_minutes} minutes
                      </p>
                    )}
                    {selectedRecipe.total_time_minutes && (
                      <p>
                        <strong>Total Time:</strong> {selectedRecipe.total_time_minutes} minutes
                      </p>
                    )}
                    {selectedRecipe.servings && (
                      <p>
                        <strong>Servings:</strong> {selectedRecipe.servings}
                      </p>
                    )}
                    {selectedRecipe.nutrition && (
                      <div>
                        <strong>Nutrition:</strong>
                        <ul>
                          {Object.entries(selectedRecipe.nutrition)
                            .filter(([key]) => key !== 'updated_at') // Exclude the updated_at field
                            .map(([key, value]) => (
                              <li key={key}>
                                {key}: {value}
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="modal-footer">
                {/* Navigation Buttons */}
                {page > 1 && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </button>
                )}
                {page < 2 && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </button>
                )}
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RecommendByUs