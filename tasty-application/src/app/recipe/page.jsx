import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getFullDetail } from '../../lib/api'
import '../../styles/RecipePage.css'

const API_URL = 'https://web422-project-server.vercel.app'

const RecipePage = () => {
  const { id } = useParams()
  const [recipeDetails, setRecipeDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFavorited, setIsFavorited] = useState(false)

  // Fetch recipe detail
  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        setLoading(true)
        const data = await getFullDetail(id)
        setRecipeDetails(data)
      } catch (err) {
        setError('Error fetching recipe details')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchRecipeDetails()
    }
  }, [id])

  // Check if favorited from backend
  useEffect(() => {
    const checkFavorite = async () => {
      const token = localStorage.getItem('token')
      if (!token || !id) return

      try {
        const res = await fetch(`${API_URL}/api/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success) {
          setIsFavorited(data.favorites.some((fav) => fav.id === id || fav.id === id))
        }
      } catch (err) {
        console.error('Error checking favorite status:', err)
      }
    }

    checkFavorite()
  }, [id])

  const handleToggleFavorite = async () => {
    const token = localStorage.getItem('token')
    if (!token || !id) return

    try {
      const endpoint = `${API_URL}/api/favorites${isFavorited ? `/${id}` : ''}`
      const method = isFavorited ? 'DELETE' : 'POST'
      const body = isFavorited ? null : JSON.stringify({ recipeId: id })

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        ...(body && { body }),
      })

      const data = await res.json()
      if (data.success) {
        setIsFavorited(!isFavorited)
        window.dispatchEvent(new Event('favoriteChanged'))
      } else {
        console.error(data.error || 'Favorite update failed')
      }
    } catch (err) {
      console.error('Error toggling favorite:', err)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="recipe-page-container">
      {recipeDetails ? (
        <>
          <div className="recipe-header">
            <h1 className="recipe-title">{recipeDetails.name || 'No name available'}</h1>
            <button
              onClick={handleToggleFavorite}
              className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
            >
              {isFavorited ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
            </button>
          </div>

          <div className="recipe-image-container">
            <img
              src={recipeDetails.thumbnail_url || 'default-image.jpg'}
              alt={recipeDetails.name || 'Recipe Image'}
              className="recipe-image"
            />
          </div>

          <p className="recipe-description">
            {recipeDetails.description || 'No description available'}
          </p>

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

          <div className="recipe-details">
            <div className="recipe-ingredients">
              <h3>Ingredients</h3>
              <ul>
                {recipeDetails.ingredients?.length ? (
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
                {recipeDetails.instructions?.length ? (
                  recipeDetails.instructions.map((step) => (
                    <li key={step.id}>{step.display_text}</li>
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
