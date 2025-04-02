import React from 'react'

const SearchBar = () => {
  return (
    <div className="input-group">
      <input
        type="text"
        className="form-control"
        placeholder="Search for recipes..."
        aria-label="Search for recipes"
      />
      <button className="btn btn-primary" type="button">
        Search
      </button>
    </div>
  )
}

export default SearchBar
