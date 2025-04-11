import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getFullDetail } from '../../lib/api'
import '../../styles/RecipePage.css'

const RecipePage = () => {
  const { id } = useParams()
  const [recipeDetails, setRecipeDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        setLoading(true)
        const data = await getFullDetail(id)
        setRecipeDetails(data)
        setLoading(false)
      } catch (err) {
        setError('Error fetching recipe details')
        setLoading(false)
      }
    }

    if (id) {
      fetchRecipeDetails()
    }
  }, [id])

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || []
    setIsFavorited(favorites.some((fav) => fav.id === Number(id)))
  }, [id])

  const handleToggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || []

    const updatedFavorites = isFavorited
      ? favorites.filter((fav) => fav.id !== Number(id))
      : [
          ...favorites,
          {
            id: recipeDetails.id,
            name: recipeDetails.name,
            thumbnail_url: recipeDetails.thumbnail_url || recipeDetails.picture_url || ''
          }
        ]

    localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
    setIsFavorited(!isFavorited)
    window.dispatchEvent(new Event('favoriteChanged'))
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="recipe-page-container">
      {recipeDetails ? (
        <>
          {/* Recipe Header */}
          <div className="recipe-header">
            <h1 className="recipe-title">{recipeDetails.name || 'No name available'}</h1>
            <button
              onClick={handleToggleFavorite}
              className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
            >
              {isFavorited ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
            </button>
          </div>

          {/* Recipe Image */}
          <div className="recipe-image-container">
            <img
              src={recipeDetails.thumbnail_url || 'default-image.jpg'}
              alt={recipeDetails.name || 'Recipe Image'}
              className="recipe-image"
            />
          </div>

          {/* Recipe Description */}
          <p className="recipe-description">
            {recipeDetails.description || 'No description available'}
          </p>

          {/* Recipe Metadata */}
          <div className="recipe-metadata">
            <div>
              <strong>Prep Time:</strong> {recipeDetails.prep_time_minutes || 'N/A'} minutes
            </div>
            <div>
              <strong>Cook Time:</strong> {recipeDetails.cook_time_minutes || 'N/A'} minutes
            </div>
            <div>
              <strong>Servings:</strong> {recipeDetails.servings || 'N/A'}
            </div>
          </div>

          {/* Recipe Ingredients and Instructions */}
          <div className="recipe-details">
            <div className="recipe-ingredients">
              <h3>Ingredients</h3>
              <ul>
                {recipeDetails.ingredients && recipeDetails.ingredients.length > 0 ? (
                  recipeDetails.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))
                ) : (
                  <li>No ingredients available</li>
                )}
              </ul>
            </div>
            <div className="recipe-instructions">
              <h3>Instructions</h3>
              <ol>
                {recipeDetails.instructions && recipeDetails.instructions.length > 0 ? (
                  recipeDetails.instructions.map((instruction) => (
                    <li key={instruction.id}>{instruction.display_text}</li>
                  ))
                ) : (
                  <li>No instructions available</li>
                )}
              </ol>
            </div>
          </div>
        </>
      ) : (
        <div>No details available for this recipe.</div>
      )}
    </div>
  )
}

export default RecipePage
