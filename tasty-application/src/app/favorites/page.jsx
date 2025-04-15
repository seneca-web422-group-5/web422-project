import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Pagination from '../../components/Pagination'

const Favorites = () => {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || []
    setFavorites(storedFavorites)

    const handleFavoriteChange = () => {
      const updatedFavorites = JSON.parse(localStorage.getItem('favorites')) || []
      setFavorites(updatedFavorites)
    }

    window.addEventListener('favoriteChanged', handleFavoriteChange)

    return () => {
      window.removeEventListener('favoriteChanged', handleFavoriteChange)
    }
  }, [])

  const handleRemove = (id) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== id)
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
    setFavorites(updatedFavorites)
  }

  return (
    <div className="container">
      <h2 className="mt-4">My Favorite Recipes ❤️</h2>
      <hr />
      {favorites.length === 0 ? (
        <p>No favorites added yet.</p>
      ) : (
        <div className="categories-grid">
          {favorites.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <img
                src={recipe.thumbnail_url || 'default-image.jpg'}
                alt={recipe.name}
                className="recipe-card-img"
              />
              <div className="recipe-card-body">
                <h3 className="recipe-card-title">{recipe.name}</h3>
                <div className="d-flex justify-content-between">
                  <Link to={`/recipe/${recipe.id}`}>
                    <button className="btn btn-primary btn-sm">View</button>
                  </Link>
                  <button className="btn btn-danger btn-sm" onClick={() => handleRemove(recipe.id)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Favorites
