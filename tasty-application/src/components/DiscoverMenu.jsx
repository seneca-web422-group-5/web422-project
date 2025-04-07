import React, { useEffect, useState } from 'react'
import { getSimilarRecipes } from '../lib/api'
import RecipeCardWithDetail from './RecipeCardWithDetail'
import '../styles/DiscoverMenu.css'

const DiscoverMenu = ({ recipeId }) => {
  const [similarRecipes, setSimilarRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const recipesPerPage = 4

  useEffect(() => {
    const fetchSimilarRecipes = async () => {
      if (!recipeId) return

      try {
        setLoading(true)

        // Check local storage for cached data
        const cachedData = localStorage.getItem(`similarRecipes_${recipeId}`)
        if (cachedData) {
          setSimilarRecipes(JSON.parse(cachedData))
          setLoading(false)
          return
        }

        // Fetch from API if not in cache
        const data = await getSimilarRecipes(recipeId)
        const results = data?.results || []
        localStorage.setItem(`similarRecipes_${recipeId}`, JSON.stringify(results))
        setSimilarRecipes(results)
      } catch (err) {
        console.error('Error fetching similar recipes:', err)
        setError('Failed to fetch similar recipes.')
      } finally {
        setLoading(false)
      }
    }

    fetchSimilarRecipes()
  }, [recipeId])

  useEffect(() => {
    if (similarRecipes.length === 0) return

    const totalPages = Math.ceil(similarRecipes.length / recipesPerPage)

    const interval = setInterval(() => {
      setCurrentPage((prevPage) => (prevPage === totalPages ? 1 : prevPage + 1))
    }, 3000) // Change page every 5 seconds

    return () => clearInterval(interval)
  }, [similarRecipes, recipesPerPage])

  if (loading) {
    return <div>Loading similar recipes...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (similarRecipes.length === 0) {
    return <div>No similar recipes found.</div>
  }

  // Pagination logic
  const indexOfLastRecipe = currentPage * recipesPerPage
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage
  const currentRecipes = similarRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe)
  const totalPages = Math.ceil(similarRecipes.length / recipesPerPage)

  return (
    <div>
      <div className="recipe-grid">
        {currentRecipes.map((recipe) => (
          <RecipeCardWithDetail key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

export default DiscoverMenu