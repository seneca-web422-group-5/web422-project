import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchRecipes } from '../../lib/api'

const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const query = searchParams.get('query')

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

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div>
      <h1>Search Results for "{query}"</h1>
      {results.length > 0 ? (
        <ul>
          {results.map((result) => (
            <li key={result.id}>
              <h2>{result.name}</h2>
              <img src={result.thumbnail_url} alt={result.name} style={{ maxWidth: '200px' }} />
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  )
}

export default SearchResults