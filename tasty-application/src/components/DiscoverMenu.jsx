import React, { useEffect, useState } from 'react'
import { getSimilarRecipes } from '../lib/api'
import RecipeCardWithDetail from './RecipeCardWithDetail'
import SmallPagination from './SmallPagination'
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

        const cachedData = localStorage.getItem(`similarRecipes_${recipeId}`)
        if (cachedData) {
          setSimilarRecipes(JSON.parse(cachedData))
          setLoading(false)
          return
        }

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

  const indexOfLastRecipe = currentPage * recipesPerPage
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage
  const currentRecipes = similarRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe)
  const totalPages = Math.ceil(similarRecipes.length / recipesPerPage)

  if (loading) return <div>Loading similar recipes...</div>
  if (error) return <div>{error}</div>
  if (similarRecipes.length === 0) return <div>No similar recipes found.</div>

  return (
    <div className="discover-menu-container">
      <h2 className="mb-4">Discover Menu</h2>
      <div className="recipe-grid">
        {currentRecipes.map((recipe) => (
          <RecipeCardWithDetail key={recipe.id} recipe={recipe} />
        ))}
      </div>

      <SmallPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

export default DiscoverMenu
