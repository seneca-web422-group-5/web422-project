import { useEffect, useState } from 'react'
import SmallPagination from '../../components/SmallPagination'
import FavoriteCardWithDetail from '../../components/FavoriteCard'
import '../../styles/FavoritePage.css'

const Favorites = () => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const recipesPerPage = 8

  const API_URL = 'https://web422-project-server.vercel.app'

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${API_URL}/api/favorites`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch favorites')
        }

        const data = await response.json()
        if (data.success) {
          setFavorites(data.favorites)
        } else {
          console.error(data.error)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [])

  const handleRemove = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/favorites/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (data.success) {
        setFavorites(data.favorites)
      } else {
        console.error(data.error)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const indexOfLast = currentPage * recipesPerPage
  const indexOfFirst = indexOfLast - recipesPerPage
  const currentFavorites = favorites.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(favorites.length / recipesPerPage)

  if (loading) return <p>Loading favorites...</p>

  return (
    <div className="favorites-container">
      <h2 className="mb-4">My Favorite Recipes ❤️</h2>
      <hr />
      {favorites.length === 0 ? (
        <p>No favorites added yet.</p>
      ) : (
        <>
          <div className="favorites-grid">
            {currentFavorites.map((recipe) => (
              <FavoriteCardWithDetail
                key={recipe._id}
                recipe={recipe}
                onRemove={handleRemove}
              />
            ))}
          </div>
          <SmallPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  )
}

export default Favorites
