import React from 'react'
import { useNavigate } from 'react-router-dom'
import { navigateToRecipe } from '../utils/helpers'
import '../styles/LatestRecipes.css'

const LatestRecipes = ({ recipes }) => {
  const navigate = useNavigate()
  // Sort recipes by created_at in descending order
  const sortedRecipes = [...recipes].sort((a, b) => b.created_at - a.created_at)

  return (
    <div className="latest-recipes-container">
      <h2 className="mb-4 text-center">Latest Recipes</h2>
      <div className="recipes-list row justify-content-center">
        {sortedRecipes.map((recipe) => (
          <div key={recipe.id} className="recipe-item col-6 col-sm-4 col-md-3 col-lg-2 text-center mb-4" onClick={() => navigateToRecipe(navigate, recipe.id)} style={{ cursor: 'pointer' }}>
            {/* Recipe Thumbnail */}
            {recipe.thumbnail_url ? (
              <img
                src={recipe.thumbnail_url}
                alt={recipe.name}
                className="recipe-thumbnail"
              />
            ) : (
              <div className="recipe-thumbnail fallback">
                <p>No Image</p>
              </div>
            )}
            {/* Recipe Name */}
            <p className="recipe-name mt-2">{recipe.name}</p>
            {/* Created At */}
            <div className="recipe-created-at d-flex align-items-center justify-content-center">
              <i className="bi bi-calendar3 me-2"></i>
              <span>{new Date(recipe.created_at * 1000).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LatestRecipes