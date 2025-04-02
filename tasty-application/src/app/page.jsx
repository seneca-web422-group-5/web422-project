import React, { useEffect, useState } from 'react'
import { searchRecipes } from '../lib/api'

const Homepage = () => {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await searchRecipes('chicken') // Example query
        setRecipes(data.results || [])
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch recipes.')
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div>
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
