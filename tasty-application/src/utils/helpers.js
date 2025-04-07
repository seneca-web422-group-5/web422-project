import React from 'react'

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

const addToRecentlyViewed = (setRecentlyViewed, recipe) => {
    setRecentlyViewed((prev) => {
      const updatedViewed = [recipe, ...prev.filter((item) => item.id !== recipe.id)].slice(0, 5)
      return updatedViewed
    })
  }

const navigateToRecipe = (navigate, id) => {
    if (id) {
      navigate(`/recipe/${id}`)
    }
  }

export { renderStars, navigateToRecipe }