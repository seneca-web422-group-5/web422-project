import React, { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'
import { recentlyViewedAtom } from '../atoms/recentlyViewedAtom'
import { navigateToRecipe, addToRecentlyViewed } from '../utils/helpers'
import RecipeModal from './RecipeModal'
import '../styles/RecipeCardWithDetail.css'
import '../styles/RecommendByUs.css'

const RecipeCardWithDetail = ({ recipe }) => {
  const navigate = useNavigate()
  const [recentlyViewed, setRecentlyViewed] = useAtom(recentlyViewedAtom)
  const [isFavorited, setIsFavorited] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [page, setPage] = useState(1)

  // Check if the recipe is already favorited on component mount
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || []
    setIsFavorited(favorites.some((fav) => fav.id === recipe.id))
  }, [recipe.id])

  const handleMoreDetailsClick = (recipe) => {
    setSelectedRecipe(recipe)
    setShowModal(true)
    setPage(1)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedRecipe(null)
  }

  const handleCardClick = () => {
    addToRecentlyViewed(setRecentlyViewed, recipe)
    navigateToRecipe(navigate, recipe.id)
  }

  const handleFavoriteToggle = (e) => {
    e.stopPropagation() // Prevent triggering the card click event

    const favorites = JSON.parse(localStorage.getItem('favorites')) || []
    let updatedFavorites

    if (isFavorited) {
      // Remove the recipe from favorites
      updatedFavorites = favorites.filter((fav) => fav.id !== recipe.id)
    } else {
      // Add the recipe to favorites
      updatedFavorites = [
        ...favorites,
        {
          id: recipe.id,
          name: recipe.name,
          thumbnail_url: recipe.thumbnail_url || 'default-image.jpg' // Handle missing thumbnail
        }
      ]
    }

    // Update localStorage and state
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
    setIsFavorited(!isFavorited)
  }

  return (
    <>
      <div className="recipe-card">
        {/* Recipe Image */}
        <div className="recipe-card-image" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
          {recipe.thumbnail_url ? (
            <img src={recipe.thumbnail_url} alt={recipe.name} />
          ) : (
            <div className="recipe-card-no-image">No Image</div>
          )}
        </div>

        {/* Recipe Name */}
        <h3 className="recipe-card-title" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
          {recipe.name}
        </h3>

        {/* Total Time */}
        <p className="recipe-card-time">
          <i className="bi bi-clock" style={{ marginRight: '5px', color: '#7F7F7F' }}></i>
          {recipe.total_time_minutes ? `${recipe.total_time_minutes} mins` : 'N/A'}
        </p>

        {/* Icons Row */}
        <div className="d-flex justify-content-between align-items-center mt-2">
          {/* Favorite Icon */}
          <div className="recommend-card-favorite-icon" onClick={handleFavoriteToggle}>
            <i className={`bi bi-heart${isFavorited ? '-fill' : ''}`}></i>
          </div>

          {/* Info Icon */}
          <div
            className="more-info-icon"
            onClick={(e) => {
              e.stopPropagation()
              handleMoreDetailsClick(recipe)
            }}
            style={{ cursor: 'pointer', color: '#7F7F7F' }}
          >
            <i className="bi bi-info-circle"></i>
          </div>
        </div>
      </div>

      {/* Bootstrap Modal */}
      {showModal && (
        <RecipeModal
          selectedRecipe={selectedRecipe}
          page={page}
          setPage={setPage}
          closeModal={closeModal}
        />
      )}
    </>
  )
}

export default RecipeCardWithDetail
