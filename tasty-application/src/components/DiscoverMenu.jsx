import React, { useEffect, useState } from 'react'
import { getSimilarRecipes } from '../lib/api'
import RecipeCardWithDetail from './RecipeCardWithDetail'
import '../styles/DiscoverMenu.css'

const DiscoverMenu = ({ recipeId }) => {
  const [similarRecipes, setSimilarRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSimilarRecipes = async () => {
      if (!recipeId) return

      try {
        setLoading(true)
        const data = await getSimilarRecipes(recipeId)
        setSimilarRecipes(data?.results || [])
      } catch (err) {
        console.error('Error fetching similar recipes:', err)
        setError('Failed to fetch similar recipes.')
      } finally {
        setLoading(false)
      }
    }

    fetchSimilarRecipes()
  }, [recipeId])

  if (loading) {
    return <div>Loading similar recipes...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (similarRecipes.length === 0) {
    return <div>No similar recipes found.</div>
  }

  return (
    <div className="recipe-grid">
      {similarRecipes.map((recipe) => (
        <RecipeCardWithDetail key={recipe.id} recipe={recipe} />
      ))}
    </div>
  )
}

export default DiscoverMenu