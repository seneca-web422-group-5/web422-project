import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { renderStars } from '../utils/helpers'
import '../styles/RecommendByUs.css'

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate()
  const [isFavorited, setIsFavorited] = useState(false)

  // Check if the recipe is in the favorites list (on initial render)
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || []
    setIsFavorited(favorites.some((fav) => fav.id === recipe.id))
  }, [recipe.id])

  const handleRecipeClick = () => {
    navigate(`/recipe/${recipe.id}`) // Navigate to the recipe detail page
  }

  const handleFavoriteToggle = (e) => {
    e.stopPropagation() // Prevent the click from triggering handleRecipeClick

    const favorites = JSON.parse(localStorage.getItem('favorites')) || []
    let updatedFavorites

    if (isFavorited) {
      updatedFavorites = favorites.filter((fav) => fav.id !== recipe.id)
    } else {
      updatedFavorites = [
        ...favorites,
        {
          id: recipe.id,
          name: recipe.name,
          thumbnail_url: recipe.thumbnail_url || 'default-image.jpg' // Handle missing thumbnail
        }
      ]
    }

    localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
    setIsFavorited(!isFavorited)
  }

  return (
    <div className="recommend-card">
      {/* Image */}
      <div className="recommend-card-image" onClick={handleRecipeClick}>
        {recipe.thumbnail_url ? (
          <img src={recipe.thumbnail_url} alt={recipe.name} />
        ) : (
          <div className="recommend-card-no-image">No Image</div>
        )}
      </div>

      {/* Rating */}
      {recipe.user_ratings && recipe.user_ratings.score ? (
        <div>
          {renderStars(recipe.user_ratings.score)}
          <p className="recommend-card-rating-count mt-0">
            {recipe.user_ratings.count_positive} positive ratings
          </p>
        </div>
      ) : (
        <p className="recommend-card-no-rating">No Ratings</p>
      )}

      {/* Recipe Name */}
      <h3 className="recommend-card-title" onClick={handleRecipeClick}>
        {recipe.name}
      </h3>

      <div
        className="recommend-card-icons d-flex justify-content-between"
        style={{ marginTop: '10px' }}
      >
        {/* Favorite Heart Icon */}
        <div
          className="recommend-card-favorite-icon"
          onClick={handleFavoriteToggle} // Only toggles the favorite state
        >
          <i className={`bi bi-heart${isFavorited ? '-fill' : ''}`} />
        </div>

        {/* More Info Icon */}
        <div className="more-info-icon d-flex justify-content-end" onClick={handleRecipeClick}>
          <i className="bi bi-info-circle"></i>
        </div>
      </div>
    </div>
  )
}

export default RecipeCard
