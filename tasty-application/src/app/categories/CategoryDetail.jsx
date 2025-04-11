import { useParams, Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import api from '../../lib/api'
import { useNavigate } from 'react-router-dom'
import { navigateToRecipe } from '../../utils/helpers'
import Pagination from '../../components/Pagination'
import RecipeCardWithDetail from '../../components/RecipeCardWithDetail'
import Sort from '../../components/Sort'

const CategoryDetailPage = () => {
  const navigate = useNavigate()
  const { categoryType } = useParams() // Get categoryType from URL
  const [recipes, setRecipes] = useState([])
  const [sortedRecipes, setSortedRecipes] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const ITEMS_PER_PAGE = 8
  const totalPages = Math.ceil(sortedRecipes.length / ITEMS_PER_PAGE)

  // Cache recipes to avoid duplicate API calls
  const cache = useRef({})

  useEffect(() => {
    if (!categoryType) {
      setError('Invalid category.')
      setLoading(false)
      return
    }

    // Check if we already have the data in the cache
    if (categoryType in cache.current) {
      setRecipes(cache.current[categoryType])
      setSortedRecipes(cache.current[categoryType])
      setLoading(false)
      return
    }

    const fetchRecipes = async () => {
      try {
        setLoading(true)
        const data = await api.searchRecipes(categoryType)
        setRecipes(data.results || []) // Assuming 'results' is the property in the response
        setSortedRecipes(data.results || []) // Set initial sorted recipes to the fetched ones
        cache.current[categoryType] = data.results || [] // Cache the fetched data
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch recipes.')
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [categoryType]) // Dependency on categoryType only

  useEffect(() => {
    const sortRecipes = (option, order) => {
      let sorted = [...recipes]
      if (option === 'name') {
        sorted.sort((a, b) => a.name.localeCompare(b.name))
      } else if (option === 'rating') {
        sorted.sort((a, b) => b.rating - a.rating)
      } else if (option === 'id') {
        sorted.sort((a, b) => a.id - b.id)
      }

      if (order === 'desc') {
        sorted.reverse()
      }

      setSortedRecipes(sorted)
    }

    // Call the sort function when `sortOption` or `sortOrder` changes
    sortRecipes('', 'asc') // Default to no sorting
  }, [recipes])

  const indexOfLast = currentPage * ITEMS_PER_PAGE
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE
  const currentRecipes = sortedRecipes.slice(indexOfFirst, indexOfLast)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleSortChange = (option, order) => {
    const sortRecipes = (option, order) => {
      let sorted = [...recipes]
      if (option === 'name') {
        sorted.sort((a, b) => a.name.localeCompare(b.name))
      } else if (option === 'rating') {
        sorted.sort((a, b) => b.rating - a.rating)
      } else if (option === 'id') {
        sorted.sort((a, b) => a.id - b.id)
      }

      if (order === 'desc') {
        sorted.reverse()
      }

      setSortedRecipes(sorted)
    }
    sortRecipes(option, order)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mt-4">
        <h2>{categoryType} Recipes</h2>
        <Sort onSortChange={handleSortChange} />
      </div>
      <hr />

      <div className="recipe-grid">
        {currentRecipes.map((recipe) => (
          <RecipeCardWithDetail key={recipe.id} recipe={recipe} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

export default CategoryDetailPage
