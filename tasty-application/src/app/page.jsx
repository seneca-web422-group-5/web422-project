import React, { useEffect, useState } from 'react'
import { getPopularCategories, searchRecipes } from '../lib/api'
import PopularCategory from '../components/PopularCategory'

const Homepage = () => {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])

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
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div>
      <PopularCategory categories={categories} />
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
