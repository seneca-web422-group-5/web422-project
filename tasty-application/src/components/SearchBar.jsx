import React, { useState, useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getAutoCompleteSuggestions } from '../lib/api'
import debounce from 'lodash/debounce'

const debouncedFetchSuggestions = debounce(async (value, setSuggestions) => {
  if (value.length > 2) {
    try {
      const data = await getAutoCompleteSuggestions(value)
      console.log('Auto-complete Suggestions:', data)
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
  const location = useLocation()

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
    console.log('Selected Suggestion:', suggestion)
    setQuery(suggestion.display)
    setSuggestions([])
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