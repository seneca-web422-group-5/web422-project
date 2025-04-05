import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFeeds, getPopularCategories, searchRecipes } from '../lib/api'
import { useRandomRecipe } from '../context/RandomRecipeContext'
import JoinUs from '../components/JoinUs'
import PopularCategory from '../components/PopularCategory'

const Homepage = () => {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  const { randomRecipe, setRandomRecipe } = useRandomRecipe()
  const navigate = useNavigate() // for randomRecipe

  const handleRecipeClick = () => {
    if (randomRecipe && randomRecipe.id) {
      navigate(`/recipe/${randomRecipe.id}`)
    }
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getPopularCategories()
        console.log('Fetched Categories Data:', data)
        const popularCategories = data.results
          .filter((tag) => tag.type === 'meal')
          .map((tag) => ({ name: tag.display_name }))
        setCategories(popularCategories)
      } catch (err) {
        console.error('Failed to fetch categories:', err)
      }
    }

    const fetchRecipes = async () => {
      try {
        // Fetch random recipe only if it's not already set
        if (!randomRecipe) {
          const feedData = await getFeeds(5, '+0700', false)
          if (feedData && feedData.results && feedData.results.length > 0) {
            const recipeItems = feedData.results.filter((item) => item.type === 'featured')
            if (recipeItems.length > 0) {
              setRandomRecipe(recipeItems[0].item) // Save to context
            } else {
              console.warn('No recipe items found in the feed.')
            }
          }
        }

        // Fetch other recipes
        const data = await searchRecipes('chicken') // Example query
        setRecipes(data.results || [])
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch recipes.')
        setLoading(false)
      }
    }
    fetchCategories()
    fetchRecipes()
  }, [randomRecipe, setRandomRecipe]) // Dependency array includes context state

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div>
      <PopularCategory categories={categories} />
      {/* Random Recipe Section */}
      {randomRecipe && (
        <div
          className="random-recipe bg-light p-4 mb-4 d-flex flex-column flex-md-row align-items-center"
          onClick={handleRecipeClick}
          style={{ cursor: 'pointer' }}
        >
          {/* Recipe Image */}
          {randomRecipe.thumbnail_url && (
            <img
              src={randomRecipe.thumbnail_url}
              alt={randomRecipe.name}
              className="img-fluid mb-3 mb-md-0 me-md-4"
              style={{ maxWidth: '300px', borderRadius: '8px' }}
            />
          )}

          {/* Recipe Details */}
          <div>
            <h1 className="mb-5">Try this amazing recipe!</h1>
            <h2 className="display-6">{randomRecipe.name}</h2>
            <p className="text-muted">{randomRecipe.description || 'Try this amazing recipe!'}</p>
          </div>
        </div>
      )}

      <JoinUs />

      <h1>Recipe List</h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <h2>{recipe.name}</h2>
            {recipe.thumbnail_url && (
              <img src={recipe.thumbnail_url} alt={recipe.name} width="200" />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Homepage
