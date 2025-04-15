import React, { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'
import { recentlyViewedAtom } from '../atoms/recentlyViewedAtom'
import { navigateToRecipe, addToRecentlyViewed } from '../utils/helpers'
import RecipeModal from './RecipeModal'
import '../styles/RecipeCardWithDetail.css'
import '../styles/RecommendByUs.css'

const API_URL = 'https://web422-project-server.vercel.app'

const RecipeCardWithDetail = ({ recipe }) => {
  const navigate = useNavigate()
  const [recentlyViewed, setRecentlyViewed] = useAtom(recentlyViewedAtom)
  const [isFavorited, setIsFavorited] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const checkIfFavorited = async () => {
      const token = localStorage.getItem('token')
      if (!token || !recipe.id) return

      try {
        const res = await fetch(`${API_URL}/api/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        if (data.success) {
          setIsFavorited(data.favorites.some((fav) => fav.id === String(recipe.id)))
        }
      } catch (err) {
        console.error('Error checking favorites:', err)
      }
    }

    checkIfFavorited()
  }, [recipe.id])

  const handleMoreDetailsClick = (recipe) => {
    setSelectedRecipe(recipe)
    setShowModal(true)
    setPage(1)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedRecipe(null)
  }

  const handleCardClick = () => {
    addToRecentlyViewed(setRecentlyViewed, recipe)
    navigateToRecipe(navigate, recipe.id)
  }

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation()
    const token = localStorage.getItem('token')
    if (!token || !recipe.id) return

    try {
      let response

      if (isFavorited) {
        response = await fetch(`${API_URL}/api/favorites/${recipe.id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } else {
        response = await fetch(`${API_URL}/api/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: String(recipe.id),
            name: recipe.name,
            thumbnail_url: recipe.thumbnail_url || 'default-image.jpg',
          }),
        })
      }

      const data = await response.json()
      if (data.success) {
        setIsFavorited(!isFavorited)
      } else {
        console.error(data.error || 'Favorite update failed')
      }
    } catch (error) {
      console.error('Favorite API error:', error)
    }
  }

  return (
    <>
      <div className="recipe-card">
        <div className="recipe-card-image" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
          {recipe.thumbnail_url ? (
            <img src={recipe.thumbnail_url} alt={recipe.name} />
          ) : (
            <div className="recipe-card-no-image">No Image</div>
          )}
        </div>

        <h3 className="recipe-card-title" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
          {recipe.name}
        </h3>

        <p className="recipe-card-time">
          <i className="bi bi-clock" style={{ marginRight: '5px', color: '#7F7F7F' }}></i>
          {recipe.total_time_minutes ? `${recipe.total_time_minutes} mins` : 'N/A'}
        </p>

        <div className="d-flex justify-content-between align-items-center mt-2">
          <div className="recommend-card-favorite-icon" onClick={handleFavoriteToggle}>
            <i className={`bi bi-heart${isFavorited ? '-fill' : ''}`}></i>
          </div>

          <div
            className="more-info-icon"
            onClick={(e) => {
              e.stopPropagation()
              handleMoreDetailsClick(recipe)
            }}
            style={{ cursor: 'pointer', color: '#7F7F7F' }}
          >
            <i className="bi bi-info-circle"></i>
          </div>
        </div>
      </div>

      {showModal && (
        <RecipeModal
          selectedRecipe={selectedRecipe}
          page={page}
          setPage={setPage}
          closeModal={closeModal}
        />
      )}
    </>
  )
}

export default RecipeCardWithDetail
