import React, { useState, useCallback, useEffect } from 'react'
import { useAtom } from 'jotai'
import { useLocation, useNavigate } from 'react-router-dom'
import { getAutoCompleteSuggestions } from '../lib/api'
import { recentSearchesAtom } from '../atoms/recentSearchesAtom'
import debounce from 'lodash/debounce'

const debouncedFetchSuggestions = debounce(async (value, setSuggestions) => {
  if (value.length > 2) {
    try {
      const data = await getAutoCompleteSuggestions(value)
      setSuggestions(data?.results || [])
    } catch (err) {
      console.error('Error fetching auto-complete suggestions:', err)
    }
  } else {
    setSuggestions([])
  }
}, 300) // 300ms debounce delay

const SearchBar = () => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [recentSearches, setRecentSearches] = useAtom(recentSearchesAtom)
  const location = useLocation()
  const navigate = useNavigate()

  // Reset query when the component is mounted
  useEffect(() => {
    setQuery('')
  }, [location])

  const fetchSuggestions = useCallback((value) => {
    debouncedFetchSuggestions(value, setSuggestions)
  }, [])

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)
    fetchSuggestions(value)
  }

  const handleSuggestionClick = (suggestion) => {
    const selectedQuery = suggestion.display
    console.log('Selected Suggestion:', selectedQuery)

    // Update recent searches
    setRecentSearches((prev) => {
      const updatedSearches = [selectedQuery, ...prev.filter((item) => item !== selectedQuery)].slice(0, 5)
      // localStorage.setItem('recentSearches', JSON.stringify(updatedSearches))
      return updatedSearches
    })

    // Navigate to search results
    setQuery(selectedQuery)
    setSuggestions([])
    navigate(`/search-results?query=${encodeURIComponent(selectedQuery)}`)
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        className="form-control"
        placeholder="Search recipes..."
        value={query}
        onChange={handleInputChange}
      />
      {suggestions.length > 0 && (
        <ul className="list-group position-absolute mt-1" style={{ zIndex: 1000 }}>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="list-group-item list-group-item-action"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.display}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchBar