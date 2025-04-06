import React, { useState } from 'react'
import { getAutoCompleteSuggestions } from '../lib/api'

const SearchBar = () => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])

  const handleInputChange = async (e) => {
    const value = e.target.value
    setQuery(value)

    if (value.length > 2) { // Fetch suggestions only if the input length is greater than 2
      try {
        const data = await getAutoCompleteSuggestions(value)
        console.log('Auto-complete Suggestions:', data)
        setSuggestions(data?.results || [])
      } catch (err) {
        console.error('Error fetching auto-complete suggestions:', err)
      }
    } else {
      setSuggestions([]) // Clear suggestions if input is too short
    }
  }

  const handleSuggestionClick = (suggestion) => {
    console.log('Selected Suggestion:', suggestion)
    setQuery(suggestion)
    setSuggestions([]) // Clear suggestions after selection
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