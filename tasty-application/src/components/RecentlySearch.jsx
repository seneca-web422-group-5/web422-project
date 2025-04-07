import React from 'react'
import { useAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'
import { recentSearchesAtom } from '../atoms/recentSearchesAtom'

const RecentlySearch = () => {
  const [recentSearches] = useAtom(recentSearchesAtom)
  const navigate = useNavigate()

  if (recentSearches.length === 0) {
    return <div>No recent searches yet</div>
  }

  const handleSearchClick = (search) => {
    navigate(`/search-results?query=${encodeURIComponent(search)}`)
  }

  return (
    <div>
      <h2>Recently Searched</h2>
      <ul>
        {recentSearches.map((search, index) => (
          <li
            key={index}
            onClick={() => handleSearchClick(search)}
            style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}
          >
            {search}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RecentlySearch