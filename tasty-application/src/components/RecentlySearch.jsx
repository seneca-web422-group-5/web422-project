import React, { useState } from 'react'
import { useAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'
import { recentSearchesAtom } from '../atoms/recentSearchesAtom'

const RecentlySearch = () => {
  const [recentSearches] = useAtom(recentSearchesAtom)
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleSearchClick = (search) => {
    navigate(`/search-results?query=${encodeURIComponent(search)}`)
  }

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev)
  }

  if (recentSearches.length === 0) {
    return <div className="text-center">No recent searches yet</div>
  }

  return (
    <div className="dropdown">
      <button
        className="recently-search-btn dropdown-toggle"
        type="button"
        id="recentSearchesDropdown"
        data-bs-toggle="dropdown"
        aria-expanded={isDropdownOpen}
        onClick={toggleDropdown}
      >
        Recently Searched
      </button>
      <ul
        className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}
        aria-labelledby="recentSearchesDropdown"
      >
        {recentSearches.map((search, index) => (
          <li key={index}>
            <button className="dropdown-item" onClick={() => handleSearchClick(search)}>
              {search}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RecentlySearch
