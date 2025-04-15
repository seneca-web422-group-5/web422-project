import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import { navigateToRecipe, renderStars, addToRecentlyViewed } from '../utils/helpers'
import { recentlyViewedAtom } from '../atoms/recentlyViewedAtom'
import RecipeModal from './RecipeModal'
import '../styles/RecommendByUs.css'

const RecommendByUs = ({ recommendations = [] }) => {
  const navigate = useNavigate()
  const [recentlyViewed, setRecentlyViewed] = useAtom(recentlyViewedAtom)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [page, setPage] = useState(1)

  const handleMoreDetailsClick = (recipe) => {
    setSelectedRecipe(recipe)
    setShowModal(true)
    setPage(1)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedRecipe(null)
  }

  const handleCardClick = (recipe) => {
    addToRecentlyViewed(setRecentlyViewed, recipe)
    navigateToRecipe(navigate, recipe.id)
  }

  if (!recommendations.length) {
    return <div>No recommendations available.</div>
  }

  return (
    <div className="recommend-container">
      <h2 className="mb-4">Recommend by Us</h2>
      <div className="recommend-list">
        {recommendations.map((item) => (
          <div key={item.id} className="recommend-card">
            {/* image */}
            <div className="recommend-card-image" onClick={() => handleCardClick(item)}>
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
            <h3 className="recommend-card-title" onClick={() => handleCardClick(item)}>
              {item.name}
            </h3>

            {/* author */}
            <p className="recommend-card-author">by {item.author || 'Unknown'}</p>

            {/* tags */}
            <div className="recommend-card-tags">
              {Array.isArray(item.tags) && item.tags.length > 0 ? (
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
              className="more-info-icon d-flex justify-content-end"
              onClick={() => handleMoreDetailsClick(item)}
            >
              <i className="bi bi-info-circle"></i>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <RecipeModal
          selectedRecipe={selectedRecipe}
          page={page}
          setPage={setPage}
          closeModal={closeModal}
        />
      )}
    </div>
  )
}

export default RecommendByUs
