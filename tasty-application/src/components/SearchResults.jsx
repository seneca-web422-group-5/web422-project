import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchRecipes } from '../lib/api'
import RecipeCardWithDetail from './RecipeCardWithDetail'
import '../styles/SearchResults.css'

const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const [results, setResults] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const query = searchParams.get('query')
  const resultsPerPage = 8

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true)
        const data = await searchRecipes(query)
        setResults(data?.results || [])
      } catch (err) {
        console.error('Error fetching search results:', err)
        setError('Failed to fetch search results.')
      } finally {
        setLoading(false)
      }
    }

    if (query) {
      fetchResults()
    }
  }, [query])

  const indexOfLastResult = currentPage * resultsPerPage
  const indexOfFirstResult = indexOfLastResult - resultsPerPage
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult)

  const totalPages = Math.ceil(results.length / resultsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div>
      <h1>Search Results for "{query}"</h1>
      <div className="results-grid">
        {currentResults.map((recipe) => (
          <RecipeCardWithDetail key={recipe.id} recipe={recipe} />
        ))}
      </div>

      <div className="pagination">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SearchResults